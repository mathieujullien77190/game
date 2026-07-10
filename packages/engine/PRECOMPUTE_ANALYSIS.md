# Analyse précalcul — packages/engine

Audit des recalculs effectués à chaque frame (`tickSim` / `drawAllPreview` dans `PreviewManager`, `drawAll` dans `EditorManager`) alors que la donnée sous-jacente est statique ou ne change que sur une action ponctuelle (édition, transformation, explosion). Classé du plus impactant au moins impactant. Chaque item a été vérifié dans le code actuel.

## 1. `SwitchPreview.prepareFrame` recalcule la géométrie des angles à chaque frame — pour une topologie qui ne change jamais pendant la simulation

`entities/Switch/SwitchPreview.ts:57-96`, appelé depuis `Manager/PreviewManager.ts:362` (`drawSwitchesBefore`, donc **chaque frame**, pour **chaque switch**).

Pour chaque switch, `prepareFrame` :
- appelle `getSwitchEnterPoint(this.linkIds, links)` (`entities/Switch/switchUtils.ts:4-22`) qui filtre les `linkIds` à chaque appel,
- appelle `curveIntersectAngle(...)` **une fois pour l'entrée, une fois pour la destination active, et une fois par lien** (`entities/Switch/switchUtils.ts:24-56`) — cette fonction marche point par point le tableau `points[]` de la ligne (espacés de `POINT_SPACING = 0.5`, `constants.ts:4`) depuis l'extrémité jusqu'à dépasser `SWITCH_R = 18` (`SwitchPreview.ts:8`), soit ~36 itérations avec un `Math.sqrt` à chaque pas.

Tout ceci ne dépend que de la géométrie des lignes et de la liste des `linkIds` du switch — des données qui ne changent que lors d'une édition (déplacement de ligne, ajout/suppression de lien), jamais pendant `tickSim`. C'est le calcul le plus coûteux et le plus inutilement répété du rendu (walk + sqrt × 3+ par switch × 60 fois/seconde).

**Piste** : calculer `_enterAngle` et `_allDestAngles` une seule fois (dans une méthode genre `computeGeometry(lines, links, linkMap)` appelée depuis `initSimulation` et re-appelée seulement quand l'éditeur modifie une ligne/lien impliquant ce switch), et ne garder dans `prepareFrame`/le tick que ce qui dépend réellement du temps (`displayAngle` qui anime déjà via `animateAngle`, `pulseTimer`).

## 2. `PreviewManager.drawStartNode` refiltre + retrie le tableau complet des tokens, par start, à chaque frame

`Manager/PreviewManager.ts:422-437` :
```ts
const startTokens = this.data.tokens.filter((t) => t.startId === start.id)
const nextWaiting = startTokens.filter((t) => this.data.elapsedSeconds < t.startAt).sort((a, b) => a.startAt - b.startAt)[0]
```
C'est un scan + un tri de `this.data.tokens` (potentiellement plusieurs dizaines d'entrées avec les cops générés dynamiquement) **par start, par frame**. Le tri est en réalité inutile : `s.tokens.forEach((tc, i) => { token.startAt = ... })` dans `initSimulation` (`PreviewManager.ts:149-158`) construit déjà les tokens d'un start dans l'ordre croissant de `startAt` — donc le premier "waiting" trouvé en itérant dans l'ordre est déjà le bon, pas besoin de `.sort()`.

**Piste** : maintenir un pointeur/index "prochain token en attente" par start (avancé une fois qu'un token a spawné), au lieu de refaire filter+sort sur toute la liste à chaque frame. Gain croît avec le nombre de tokens/starts.

## 3. `TokenPreview.drawShape` recalcule un hash d'ID par regex à chaque frame, pour chaque token

`entities/Token/TokenPreview.ts:258` :
```ts
const phase = (parseInt(this.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2)
```
Appelé depuis `animShape` → `runAnimations` à chaque `drawBefore`, donc **chaque frame, pour chaque token non-explosant**. `this.id` ne change jamais après construction : c'est un candidat de précalcul trivial (le regex + `parseInt` répétés sont pur gaspillage).

**Piste** : calculer `phase` une fois dans le constructeur de `Token`/`TokenPreview` (ou en lazy-cache au premier accès) et le stocker comme champ, au lieu de le recalculer à chaque `drawShape`.

## 4. `TokenPreview.drawExplosion` régénère le pseudo-random des débris à chaque frame au lieu de le figer à l'explosion

`entities/Token/TokenPreview.ts:299-331` : la boucle `for (let k = 0; k < 8; k++)` appelle `rng(k)`, `rng(k+10)`, `rng(k+20)`, `rng(k+25)` (4 `Math.sin` par pièce, donc **32 `Math.sin` par token explosant, par frame**) pour dériver `angle`, `speed`, `size`, `target`. Ces valeurs ne dépendent que de `explosionSeed`, fixé une fois dans `PreviewManager.tickSim:307-308` (`active[i].explosionSeed = (Math.random() * 999999) | 0`) — elles sont donc constantes pour toute la durée de l'explosion (~2s + 8s de fade, cf. `EXPLOSION_DURATION`/`FADE_DURATION`, `PreviewManager.ts:4,312`). Seuls `progress`/`fade` varient réellement frame par frame.

**Piste** : au moment où `exploding` passe à `true` (`PreviewManager.ts:307-308`), précalculer un tableau de 8 `{angle, speed, size, target}` et le stocker sur le token ; `drawExplosion` n'a plus qu'à lire ce tableau et appliquer `progress`/`fade`.

## 5. `EditorManager.drawGrid` fait un `beginPath()`/`stroke()` séparé par ligne de grille au lieu d'un seul path batché

`Manager/EditorManager.ts:81-101` : 4 boucles (mineure X, mineure Y, majeure X, majeure Y) qui font chacune `ctx.beginPath(); ctx.moveTo(...); ctx.lineTo(...); ctx.stroke()` **par itération**. Pour `CANVAS_W=405`/`CANVAS_H=720` avec `GRID_MINOR=20` (`constants.ts:1,2,5`), ça fait environ 20+36 lignes mineures + 4+7 lignes majeures ≈ 67 appels `stroke()` séparés, à chaque redraw de l'éditeur (déclenché par `revision`, hover, mousemove — donc potentiellement très fréquent en édition interactive).

La grille est 100% statique (ne dépend que des constantes `CANVAS_W/H/GRID_MINOR/MAJOR`), donc l'idéal serait un cache bitmap offscreen blitté une fois — **mais l'interface `Renderer` (`render/Renderer.ts`) n'expose aucune primitive offscreen/`drawImage`/Path2D** (vérifié : seulement path/fill/stroke/transform), donc ce n'est pas faisable sans étendre cette interface (impact sur le contrat "zéro DOM" de l'engine à évaluer séparément).

**Piste immédiatement faisable sans toucher `Renderer`** : garder la boucle mais faire un seul `beginPath()` + toutes les `moveTo`/`lineTo` de la couleur mineure + un seul `stroke()`, puis pareil pour la majeure — passe de ~67 à 2 appels `stroke()`, sans changer le rendu.

## 6. `Object.values(...)` recalculé plusieurs fois par frame sur le même record

Dans `Manager/PreviewManager.ts`, les mêmes records sont ré-itérés via `Object.values()` à des endroits différents du **même frame** :
- `this.data.switches` : `tickSim:175`, `drawSwitchesBefore:361`, `drawSwitchesAfter:447` (3×/frame)
- `this.data.transformers` : `drawTransformers:387`, `drawTransformersAfter:398` (2×/frame)
- `this.data.screenGates` : `drawScreenGateMarkers:371`, `drawScreenGates:474` (2×/frame)

`Object.values()` alloue un nouveau tableau à chaque appel — pas dramatique en soi (les records sont petits dans ce jeu), mais c'est un gaspillage facile à éviter.

**Piste** : calculer une fois par frame (au début de `drawAllPreview`) les tableaux `switchesArr`/`transformersArr`/`screenGatesArr` et les passer aux méthodes `drawXBefore`/`drawXAfter`/`tickSim` au lieu de laisser chacune refaire son propre `Object.values()`.

## Vérifié mais pas retenu

- `stats.ts:drawStats` (`fillText` + template string par frame) : coût négligeable (un seul appel, pas de regex/tri/trig), ne justifie pas un cache.
- `ScreenGatePreview.animTokensInside` (`entities/ScreenGate/ScreenGatePreview.ts:73-91`) parcourt tous les tokens par gate par frame, mais le travail par token est trivial (une soustraction + `drawMini`) — pas de gain réel à en tirer avec le volume de tokens de ce jeu.
- `TransformerPreview` (angles d'orbite, trails) : tout dépend légitimement de `elapsedSeconds`/`transformProgress`, rien à précalculer.

## Ce qui est déjà bien précalculé (à ne pas casser)

- **`Line.computePoints()`** (`entities/Line/Line.ts:56-188`) : le calcul le plus lourd de tout l'engine (échantillonnage bézier/spirale/sine + reparamétrisation par longueur d'arc) n'est fait qu'à la construction de la ligne et sur édition explicite (`flip`, `frequency`, `turns`...) — jamais dans la boucle de simulation. Bon exemple à suivre pour les points 1 et 4 ci-dessus.
- **Tables de lookup construites une fois dans `initSimulation`** (`Manager/PreviewManager.ts:81-135`) : `linkByEndpointKey`, `linkMap`, `transformerByLinkId`, `inverterLinkMap`, `screenGateByLinkId`, `screenGateByExitKey` — toutes construites une seule fois au chargement de la map, puis consultées en O(1) dans `tickSim`/`TokenPreview.transition` au lieu d'être recalculées.
- **`getMiniMapRect()`** (`Manager/PreviewManager.ts:533-540`) : déjà factorisé pour éviter un calcul dupliqué entre `drawMiniMap` et `clickAt`.

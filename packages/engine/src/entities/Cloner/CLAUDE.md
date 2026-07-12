# Cloner/ — nœud de duplication de token

## Structure

- `Cloner.ts` — base : `id` (`createIdCounter("cloner")`), `linkIds` (tous les links convergeant sur ce nœud, même mécanique que `Switch`), `screenId`. Pas de `color` (le rendu est toujours gris, cf. Rendu) ni d'`activeLinkId`/`mode` : contrairement à `Switch`, un `Cloner` n'a pas de sortie "active" unique — toutes ses sorties se déclenchent ensemble.
- `ClonerEditor.ts` — exporte `drawClonerShape(ctx, pt)` (disque plein `COLORS.clonerGhost`, réutilisé par `EditorManager` pour le ghost-preview au placement), `ClonerEditor.draw` n'est qu'un appel direct. `COLORS.clonerGhost` reste défini dans `theme.ts` même si l'instance elle-même n'a plus de `color` — uniquement pour ce ghost.
- `ClonerPreview.ts` — visuel façon `Transformer` (disque blanc + anneau gris + pastilles orbitales), et point d'ancrage (`getPoint`) pour la simulation. Réutilise `getSwitchEnterPoint`/`curveIntersectAngle` de `../Switch/switchUtils` (générique sur `linkIds`/`links`, zéro couplage à `Switch`) plutôt que de dupliquer cette géométrie.

## Entrée fixe (comme Switch), pas d'interaction joueur

- Pas de champ "lien d'entrée" stocké, mais l'entrée **n'est pas dynamique pour autant** : exactement comme `Switch`, elle est déterminée par `getSwitchEnterPoint(linkIds, links)` — le point physique commun à tous les links de `linkIds`. `linkIds` ne contient que les links où la ligne d'entrée apparaît comme un côté (cf. `useEditorInteraction` côté edition, identique à `addSwitch` au placement), donc **toutes** ses sorties pointent déjà vers "l'autre ligne du carrefour" — pas besoin d'exclure quoi que ce soit à l'arrivée.
- **Modifiable après coup** : `ClonerTab` affiche un champ "enter" (`ToggleGroup` de tous les endpoints du carrefour, comme `SwitchTab`) qui recalcule `linkIds` via `updateClonerLinks(id, newLinkIds)` — mêmes `newLinkIds` = tous les links où l'endpoint choisi apparaît comme un côté. Pas de notion d'"active output" à gérer en plus (contrairement à `Switch`), puisque toutes les sorties sont toujours actives ; pas de sélecteur de couleur non plus (voir Rendu).
- Un token qui arrive par une des **autres** lignes du carrefour (pas la ligne d'entrée canonique) ne traverse pas le `Cloner` du tout — il suit le link brut entre ces deux lignes s'il existe et est activé (exactement le même comportement que `Switch` pour un spoke non-entrant : voir `Switch/CLAUDE.md`).
- Aucun `hitTest`/`cycle()` : un `Cloner` n'est pas cliquable en preview, tout est automatique (contrairement à `Switch` en mode `manual`).

## Fonctionnement (voir `Token/CLAUDE.md` et `Manager/CLAUDE.md`)

- La duplication réelle vit dans `TokenPreview.transition()`, pas ici — cette classe ne fait que du rendu + compter les sorties. Un token qui arrive sur l'endpoint canonique indexé par `clonerByEnterKey` déclenche, pour chaque link **activé** (`link.activated`) de `linkIds` :
  - un nouveau `TokenPreview` (couleur/forme/vitesse/orientation identiques, id auto via le compteur `token` existant), positionné sur son link de destination, **direction réelle appliquée tout de suite** (il part immédiatement, pas de gel) mais **invisible** (`opacity = 0`, `pendingOpacity` = opacité du parent, `fadingOpacity = true`) — il se matérialise en route plutôt que d'apparaître d'un coup.
  - le token consommé, lui, **ne s'arrête pas non plus** : il continue sur la **première** sortie activée (même ligne/point/direction qu'un clone) tout en se fondant vers `pendingOpacity = 0` (même mécanisme `fadingOpacity`) plutôt que de rester figé sur le carrefour — `arrived` n'est posé (et donc le token retiré) qu'une fois ce fondu terminé. S'il n'y a aucune sortie activée (cas dégénéré), il reste sur place (`direction = 0`) en se fondant quand même.
  - `cloner.trigger()` — arme `burstTimer` pour la rotation rapide des pastilles (voir Rendu).
- `tick(deltaSeconds)` : décrémente `burstTimer` et accumule `_dotAngle` (vitesse idle ou rapide selon `burstTimer`) — appelé pour tous les cloners à chaque frame par `PreviewManager.tickSim`, indépendamment de l'écran affiché (comme `Switch.tick`).
- `prepareFrame(lines, links)` (appelé par `PreviewManager.drawClonersBefore`) recalcule chaque frame `_pt` et `_allAngles` (une direction par sortie active), via `curveIntersectAngle` pour aligner sur la tangente réelle d'une ligne courbe/sine/spiral. Seul `_allAngles.length` (= N) sert au rendu actuel — les directions elles-mêmes ne sont pas dessinées.

## Rendu

- `drawBefore` : `drawStatic` dessine un disque blanc plein de rayon `RADII.ring` — même échelle que l'anneau de `Transformer`.
- `drawAfter` : `animRing` (anneau gris statique `COLORS.grayLight`, `STROKE_WIDTHS.heavy` — même épaisseur que l'anneau de `Start`, sans dot orbital, juste le cadre visuel emprunté à `Transformer`), puis `animInner`.
- `animInner` : **N pastilles grises** (`COLORS.gray`, pas de couleur par instance), N = nombre de sorties actives, réparties sur le bord de l'anneau (rayon `ORBIT_R` = `RADII.ring`), déphasées de `2π/n`. Une seule formule de position, pas d'état "pétales"/"départ" séparé : `_dotAngle`, accumulé dans `tick()` (jamais dérivé du temps absolu), tourne à `IDLE_SPIN_SPEED` en idle et bascule à `FAST_SPIN_SPEED` (3 tours sur `CLONE_BURST_DURATION` = 1.5s, même échelle que `PAINT_DURATION`) tant que `burstTimer > 0`. Comme c'est un changement de **vitesse** et non de position, il n'y a jamais de saut visuel au déclenchement/à la fin du burst.
- La matérialisation/disparition des tokens (fondu d'opacité) est portée par les tokens eux-mêmes (`TokenPreview.fadingOpacity`, cf. `Token/CLAUDE.md`), pas par cette classe — la rotation rapide des pastilles n'est qu'un flourish visuel signalant "quelque chose se déclenche ici", découplé du fondu réel des tokens.

## Persistence (`Map/mapJson.ts`)

- `MapJson.cloners?: Record<string, { linkIds: string[]; screenId?: string }>` — pas de `color`. `serializeMap` n'écrit `screenId` que si différent de `"main"`. `deserializeMap` reconstruit un `ClonerEditor` par entrée puis `syncClonerCounter` sur les ids chargés (cf. `idCounter`).

# Line/ — segment de rail

## Structure

- `Line.ts` — base : `start`/`end`/`cp1`/`cp2` (points de contrôle), `type: "straight" | "curve" | "sine" | "elbow" | "spiral"`, `points: Point[]` (précalculé, chaque `Point` porte ici son `angle`), plus les paramètres par type : `boost`, `tunnel`, `showSpeed`, `limitation`, `frequency`/`amplitude` (sine), `turns` (spiral), `flip` (elbow).
- **ID à part** : contrairement aux autres entités, `Line` n'utilise pas `createIdCounter` — `generateLineId()` génère d'abord des lettres (`lineA`…`lineZ`), puis bascule sur des nombres (`line1`, `line2`…) une fois l'alphabet épuisé. `syncLineCounter` gère les deux formats (`/^line([A-Z])$/` et `/^line(\d+)$/`).
- `LineEditor.ts` — trait pointillé (plein si hover), poignées de contrôle si `curve` (points cp1/cp2 + guides pointillés) ou `elbow` (poignée au coin), point de départ jaune, point d'arrivée bleu plus gros, `drawId` (label au milieu, position dépend du type).
- `LinePreview.ts` — `drawStatic` : rail gris (ou juste deux points noirs si `tunnel`, le rail est alors invisible). `drawGlow` (animation) : fenêtre de points en surbrillance jaune qui parcourt `points[]` en boucle, vitesse/direction dépendant de `boost` (positif → sens direct, négatif → sens inverse). `drawAfter` : badge de vitesse (`showSpeed`) et/ou badge de limitation (`limitation`) au milieu de la ligne.

## `computePoints()` — un algorithme par type

- `straight` : interpolation linéaire, angle constant.
- `curve`/`elbow` : bézier cubique (cp1/cp2), reparamétrée par longueur d'arc (échantillonnage à N=300 points puis recherche dichotomique) pour un espacement régulier des `points[]`. `elbow` recalcule `cp1`/`cp2` à chaque fois à partir de `start`/`end`/`flip` pour former un coin à angle droit.
- `sine` : offset sinusoïdal perpendiculaire au segment start→end, amplitude/fréquence configurables.
- `spiral` : échantillonnage polaire autour de `start`, `turns` tours, puis reparamétrage par longueur d'arc comme `curve`.

Chaque `Point` de `points[]` porte un `angle` (tangente locale, optionnel dans le type mais toujours renseigné ici) utilisé par les tokens pour s'orienter (rotation des carrés) et par les switches/screenGates pour aligner leurs indicateurs.

## Fonctionnement

- `showSpeed`/`limitation` ne sont dessinés par `LinePreview.drawAfter` que si `PreviewManager.drawLinesAfter` trouve un token actuellement sur cette ligne — sinon les paramètres sont `undefined`. `lastSpeed` mémorise la dernière valeur connue : le badge reste affiché (valeur figée) même après que le token a quitté la ligne, jusqu'au prochain passage.
- `tunnel` cache le rail (`drawStatic`) mais rend aussi le **token** invisible pendant la traversée : `PreviewManager.drawTokens` passe `opacityOverride = 0` à `token.drawBefore` quand `line.tunnel`, cf. `Token/CLAUDE.md` (`_opacityOverride`).
- `boost` n'affecte que l'esthétique du glow ici ; l'accélération réelle du token est gérée côté `PreviewManager`/`TokenPreview` (vitesse courante), pas par `Line`.

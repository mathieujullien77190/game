# Token/ — balle colorée

## Structure (2 fichiers seulement, pas de TokenEditor)

- `Token.ts` — base : `id` (`createIdCounter("token")`), `color` (`TokenColor`, une des `TOKEN_COLORS`), `type: "round" | "square" | "cop"`, `speed`.
- **Pas de `TokenEditor.ts`** : un token ne se place jamais directement sur le canvas éditeur — il n'existe que comme entrée `TokenConfig` dans le tableau `tokens[]` d'un `Start`, configuré via l'onglet Start. Rien à éditer sur le canvas pour un token isolé.
- `TokenPreview.ts` — tout le moteur de simulation d'un token vit ici (avancement, routage, rendu).

## Avancement et routage

- `advance(deltaSeconds, pointCount)` : avance `pointIndex` le long de la ligne courante selon `currentSpeed` (accumulé dans `remainder`, pas par `POINT_SPACING`). Retourne `{hit: "start"|"end", excess}` en bout de ligne, `null` sinon.
- `transition(arrivedAt, excess, ctx)` : machine à états appelée par `PreviewManager` sur chaque `hit`, dans cet ordre de priorité :
  1. retour de portail (`portalContext`, si le token revient d'un `ScreenGate`)
  2. arrivée (compare `demands[currentDemandIndex]` — couleur, type, et orientation si carré — voir `Arrival/CLAUDE.md`)
  3. effet transformer `rotate` (`targetRotationOffset += 2.25π`, soit +45° net par passage : `2.25π mod π/2 = π/4`)
  4. effet inverter (toggle `isInverted`/`isGrayscale`/`isDark`)
  5. `ScreenGate` (stocke `portalContext` pour le retour, saute à la ligne d'entrée du gate)
  6. transformer `color`/`shape`/`fade` (immobilise le token — `direction = 0` — pendant `PAINT_DURATION`, anime `colorProgress`/`pendingType`/`opacityFrom`)
  7. suivi normal du link (`linkMap`) ou arrêt en cul-de-sac (`direction = 0`)

## Rendu

- `drawShape` : `cop` clignote rouge/bleu sur un sinus temps réel (couleur ignorée) ; `round`/`square` pulsent légèrement (phase dérivée de l'id numérique) et affichent un halo semi-transparent quand en mouvement. Le carré tourne selon `pt.angle + rotationOffset` (`rotationOffset` suit `targetRotationOffset` en douceur, lissé dans `PreviewManager.tickSim`).
- `drawExplosion` : animation de collision token-vs-token (8 débris colorés, `rng` seedé par `explosionSeed`) — déclenchée/nettoyée par `PreviewManager.tickSim` (détection de collision), pas par cette classe.
- `drawMini` : forme réduite avec contour noir — utilisée uniquement par `PreviewManager.drawMiniMap` et par `ScreenGatePreview.animTokensInside` ; ce sont les deux seuls endroits où un token est dessiné hors de sa ligne.
- `opacity` (état réel, modifié par le transformer `fade`) vs `_opacityOverride` (clamp additionnel ponctuel, ex. `tunnel` — voir `Line/CLAUDE.md`) : le getter `_eff` retourne le `min` des deux, sans modifier `opacity`.

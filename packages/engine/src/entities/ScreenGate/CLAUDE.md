# ScreenGate/ — portail vers un écran imbriqué

## Structure

- `ScreenGate.ts` — base : `id` (`createIdCounter("gate")`), `linkId`, `screenId` (écran où vit la porte), `targetScreenId` (écran imbriqué visé), `entryKey`/`exitKey` (endpoints `"lineId::endpoint"` de téléportation sur `targetScreenId`).
- `ScreenGateEditor.ts` — exporte `GATE_W = 36` / `GATE_H = 64` (dimensions du rectangle, seule source de vérité — importées aussi par `ScreenGatePreview` et par `EditorManager` pour le ghost-preview) et `drawGateShape(ctx, pt)` (rectangle arrondi blanc/contour noir). `ScreenGateEditor.draw` n'est qu'un appel direct.
- `ScreenGatePreview.ts` — constructeur étendu (accepte `targetScreenId`/`entryKey`/`exitKey` directement, contrairement aux autres `*Preview` qui ne prennent que les champs de base) car nécessaires dès `initSimulation`. `timeMultiplier` (affiché en haut du rectangle via `fmtMult`, ex. `×0.5`).

## Fonctionnement

- **Purement visuel** — la téléportation réelle (retour par `exitKey`, entrée par `entryKey`) est gérée par `TokenPreview.transition()` via les index `screenGateByLinkId`/`screenGateByExitKey` construits par `PreviewManager.initSimulation`. `timeMultiplier` (affichage uniquement) vient de `screenTimeMultipliers[targetScreenId]` — la même map pilote, dans `PreviewManager.tickSim`, le `deltaSeconds` effectif de chaque token selon `tokenMult / viewedMult` (le multiplicateur de l'écran du token relatif à celui de l'écran actuellement affiché) : un écran ×0.5 s'écoule deux fois plus lentement vu depuis un écran ×1.
- `drawEntry`/`drawExit` : méthodes à part (pas `drawBefore`/`drawAfter`) — petits marqueurs (point plein / anneau + point) dessinés **sur l'écran cible** aux endpoints `entryKey`/`exitKey`, via `PreviewManager.drawScreenGateMarkers` (passe séparée, avant `drawArrival`, pour visualiser où mène une porte en naviguant dans l'écran imbriqué).
- `animTokensInside` : clippe au rectangle de la porte et dessine une miniature des tokens actuellement présents sur `targetScreenId` (`token.drawMini`) — c'est ce qui permet d'apercevoir en direct l'activité de l'écran imbriqué depuis l'écran parent, sans y naviguer. Alimenté par les `tokens`/`lines`/`elapsed` passés en paramètre à `drawAfter` (stockés dans `_tokens`/`_lines`/`_elapsed`).
- Timing : `drawBefore` vide, tout dans `drawAfter` (après `drawStartAfter`, voir `Manager/CLAUDE.md`).

# ScreenGate/ — portail vers un écran imbriqué

Purement visuel : la téléportation réelle (via `entryKey`/`exitKey`) vit dans `TokenPreview.transition()`. Affiche une miniature en direct des tokens de l'écran cible.

## Structure
- `ScreenGate.ts` — base : `linkId`, `screenId`, `targetScreenId`, `entryKey`/`exitKey`.
- `ScreenGateEditor.ts` — exporte `GATE_W`/`GATE_H` + `drawGateShape` (rectangle arrondi).
- `ScreenGatePreview.ts` — rectangle + `timeMultiplier` affiché ; `drawEntry`/`drawExit` (marqueurs sur l'écran cible) ; `animTokensInside` (miniature des tokens de `targetScreenId`).

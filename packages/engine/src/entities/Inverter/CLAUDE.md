# Inverter/ — nœud d'inversion sur un link

Reflète visuellement l'état d'un effet plein écran. L'effet réel est togglé par `TokenPreview.transition()` au passage d'un token, et appliqué côté `canvas-render` (`applyScreenEffects`), pas dans l'engine.

## Structure
- `Inverter.ts` — base : `linkId`, `effect: "invert" | "grayscale" | "dark"`, `screenId`.
- `InverterEditor.ts` — exporte `drawInverterShape` (trait perpendiculaire violet, ghost-preview).
- `InverterPreview.ts` — deux pastilles rouge/verte dont l'opacité s'inverse selon `active`.

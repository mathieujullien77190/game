# Start/ — point de spawn des tokens

Fait apparaître une file de tokens (`tokens: TokenConfig[]`) à intervalle `delay` (le premier à `firstDelay`).

## Structure
- `Start.ts` — base : `lineId`, `endpoint`, `delay`, `firstDelay`, `tokens[]`, `fadeLineAfter`, `screenId`.
- `StartEditor.ts` — exporte `drawStartShape` (disque noir + triangle « play », ghost-preview).
- `StartPreview.ts` — anneau de compte à rebours (`animCountdownArc`) ; `prepareFrame` pousse l'état transitoire chaque frame.

⚠️ **Un seul start actif** : bien que `starts` soit une Record, seul `Object.values(starts)[0]` sert à la simulation.

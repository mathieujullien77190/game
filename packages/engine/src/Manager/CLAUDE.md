# Manager/ — orchestration

Deux managers au-dessus des entités.

## Structure
- `Manager.ts` — base générique `Manager<T>` : stocke `data.lines` + `addLine`. Jamais instancié seul.
- `EditorManager.ts` — travaille avec les `*Editor` ; gère l'édition et la **génération auto des links** (`addLine`).
- `PreviewManager.ts` — travaille avec les `*Preview` ; gère la **simulation + le rendu**.

## PreviewManager — cycle de vie
- `initSimulation(...)` — construit les `*Preview`, peuple les index de lookup, instancie les tokens avec leur `startAt`.
- `tickSim(timestamp)` — chaque frame : avance les tokens, résout les `transition()`, accumule `elapsedSeconds`.
- `drawAllPreview(ctx)` — séquence de passes nommées (rails, nœuds, tokens, HUD), une par responsabilité.
- `animationsEnabled` — flag global : `false` coupe la couche animée des entités.

## Index de lookup dans `data`
- `linkByEndpointKey["lineId::endpoint"]` → id du link (tous, activés ou non)
- `linkMap["lineId::endpoint"]` → destination (activés seulement)
- `transformerByLinkId` / `inverterLinkMap` / `screenGateByLinkId` / `screenGateByExitKey` / `arrivalByKey` / `clonerByEnterKey` → résolution du nœud par clé.

## Note
Les effets plein écran (`isInverted`/`isGrayscale`/`isDark`) ne sont que de l'état ici ; ils sont appliqués côté `canvas-render` (`applyScreenEffects`). Le `Profiler` encadre chaque passe (coût nul quand désactivé, éliminé du bundle mobile) — voir `../CLAUDE.md`.

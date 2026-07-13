# Switch/ — nœud de branchement

Aiguille : le joueur clique pour cycler la sortie active parmi `linkIds`. Le routage réel est écrit dans `linkMap` par `applyToLinkMap()` ; le reste est du feedback visuel.

## Structure (4 fichiers)
- `Switch.ts` — base : `linkIds`, `activeLinkId`, `color`, `screenId`.
- `switchUtils.ts` — helpers géométriques partagés : `getSwitchEnterPoint` (point d'entrée commun aux links) et `curveIntersectAngle` (angle tangent réel sur une ligne courbe). Réutilisés par Cloner.
- `SwitchEditor.ts` — exporte `drawSwitchShape` (disque violet, ghost-preview).
- `SwitchPreview.ts` — routage (`cycle`, `applyToLinkMap`, `hitTest`) + flèches animées. Mode `"auto"` : rendu/hitTest no-op.

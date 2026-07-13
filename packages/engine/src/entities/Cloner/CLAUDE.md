# Cloner/ — nœud de duplication de token

Duplique un token vers **toutes** ses sorties activées en même temps (pas de sortie « active » unique comme Switch ; pas d'interaction joueur). La duplication réelle vit dans `TokenPreview.transition()`.

## Structure
- `Cloner.ts` — base : `linkIds` (links du carrefour), `screenId`. Pas de `color` ni d'`activeLinkId`.
- `ClonerEditor.ts` — exporte `drawClonerShape` (disque `clonerGhost`, ghost-preview).
- `ClonerPreview.ts` — visuel façon Transformer (disque blanc + anneau gris + N pastilles orbitales). Réutilise `getSwitchEnterPoint`/`curveIntersectAngle` de `../Switch/switchUtils`.

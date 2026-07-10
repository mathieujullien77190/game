# Inverter/ — nœud d'inversion sur un link

## Structure

- `Inverter.ts` — base : `id` (`createIdCounter("inv")`), `linkId`, `screenId`, `effect: "invert" | "grayscale" | "dark"` (défaut `"invert"`).
- `InverterEditor.ts` — exporte `drawInverterShape(ctx, pt, angle)` : trait perpendiculaire à `angle` (violet `#7b1fa2`, longueur 14 de chaque côté), et `InverterEditor.draw` n'est qu'un appel direct à cette fonction. Réutilisée telle quelle par `EditorManager` pour le ghost-preview (appelée avec `angle = -Math.PI / 2` pour reproduire le trait horizontal affiché avant qu'une ligne ne soit choisie — vérifié algébriquement, pas une approximation).
- `InverterPreview.ts` — `active: boolean`, `drawStatic` vide (tout est animé). `animDots` dessine deux pastilles (rouge `#e53935` / verte `#4caf50`) de part et d'autre du nœud, dont l'opacité s'inverse selon `active`.

## Fonctionnement

- L'inverter ne fait que **refléter visuellement** un état — l'effet réel (`isInverted` / `isGrayscale` / `isDark` sur `PreviewManager.data`) est appliqué par `TokenPreview.transition()` quand un token traverse le link (lookup `ctx.inverterLinkMap.get(linkId)`), pas par cette classe. `PreviewManager.drawInverters` resynchronise `inv.active` depuis `data.isInverted/isGrayscale/isDark` (selon `inv.effect`) à chaque frame, juste avant de dessiner.
- Timing : `drawBefore` est vide, tout le rendu est dans `drawAfter`, appelé par `PreviewManager.drawInverters` **après** `drawTokens` — l'inverter est synchronisé sur l'état courant (`isInverted`/etc.) au moment où `PreviewManager` boucle sur les inverters de l'écran, pas au moment où le token traverse.
- Les effets plein écran eux-mêmes (assombrissement, niveaux de gris, inversion des couleurs) sont appliqués côté `canvas-render` (`applyScreenEffects`), pas dans l'engine — voir `Manager/CLAUDE.md`.

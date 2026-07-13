# Transformer/ — nœud de transformation sur un link

Change couleur, forme ou opacité (ou fait tourner) le token qui traverse un link. Une instance ne porte qu'un seul effet (`type`). L'application réelle sur le token vit dans `TokenPreview.transition()`.

## Structure
- `Transformer.ts` — base : `linkId`, `type: "fade" | "rotate" | "color" | "shape"`, `amount`, `color`, `targetType`, `screenId`.
- `TransformerEditor.ts` — exporte `TYPE_COLOR` (map type → hex, source unique des 4 couleurs).
- `TransformerPreview.ts` — rendu en 2 temps : `drawBefore` (statique, sous les tokens : disque + glyphe), `drawAnimation` (animé, au-dessus : point orbital + traînée via `orbitingDot` de `Utils/anim.ts`, ou flèches pour `rotate`).

## Note
La couche animée passe par `runAnimations` (comme toutes les entités) : le flag global `PreviewManager.animationsEnabled` (porté par `Animation.ts`) la coupe en une ligne — pour **toutes** les entités à la fois.

# Conventions de l'engine

## Structure

```
engine/
  types.ts        → types partagés (Point…)
  grid.ts         → utilitaires grille
  draw.ts         → fonctions de rendu canvas
  EntityName/
    EntityName.ts → classe
    utils.ts      → logique pure
    index.ts      → export default
```

## Règles

- Tout en arrow functions — pas de `function` declarations
- Pas de logique React — uniquement du code pur (calculs, canvas)
- Une fonction par élément visuel dans `draw.ts`, signature `(ctx, ...) => void`
- Pas de magic numbers — toujours exporter les constantes

# Conventions de l'engine

## Structure

```
engine/
  types.ts        → types partagés (Point…)
  grid.ts         → utilitaires grille
  draw/
    index.ts      → re-exports publics
    EntityName/
      draw.ts       → fonctions de rendu canvas statiques
      animation.ts  → fonctions de rendu canvas animées (optionnel)
      constants.ts  → constantes visuelles (durées, rayons…) (optionnel)
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
- Durées d'animation en ms dans `constants.ts` de l'entité — step calculé via `1000 / (duration * FPS)`

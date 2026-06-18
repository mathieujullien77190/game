# Conventions de l'engine

## Structure

```
engine/
  types.ts        → types partagés (Point, LineRef, Anchor…)
  colors.ts       → PALETTE, DEFAULT_COLOR, DEFAULT_BALL_COLOR, EDITOR_COLORS
  constants.ts    → FPS, etc.
  grid.ts         → utilitaires grille
  EntityName/
    EntityName.ts → classe avec méthodes de rendu et logique pure intégrées
    index.ts      → export default (et types si besoin)
```

## Règles

- Tout en arrow functions — pas de `function` declarations
- Pas de logique React — uniquement du code pur (calculs, canvas)
- Rendu canvas intégré dans la classe : méthodes d'instance pour le rendu contextualisé, `static` pour le rendu générique
- Pas de magic numbers — constantes exportées depuis `colors.ts` ou `constants.ts`
- Durées d'animation en ms comme `static readonly` sur la classe — step calculé via `1000 / (duration * FPS)`

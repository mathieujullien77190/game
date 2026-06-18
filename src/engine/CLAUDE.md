# Conventions de l'engine

## Structure

```
engine/
  types.ts        → types partagés (Point, LineRef, Anchor…)
  colors.ts       → PALETTE, DEFAULT_COLOR, DEFAULT_BALL_COLOR, EDITOR_COLORS
  constants.ts    → FPS=60, BASE_PX_PER_SEC=10, PAINTER_HOLD_MS=500
  grid.ts         → utilitaires grille
  EntityName/
    EntityName.ts     → classe de base (données + constructeur)
    EntityPreview.ts  → extends Base, méthodes drawPreview
    EntityEditor.ts   → extends Preview, méthodes drawEditor
    index.ts          → exports
```

## Hiérarchie de classes obligatoire

**`Base → Preview → Editor`** — même pattern pour toutes les entités.

- `Base` : données pures (id, position/input, etc.), pas de canvas
- `Preview` : dessine en mode simulation (drawPreview, drawAnim si animé)
- `Editor` : dessine en mode édition (drawEditor), peut avoir des méthodes static

Exemples : `Switch → SwitchPreview → SwitchEditor`, `Painter → PainterPreview → PainterEditor`

## Règles

- Tout en arrow functions — pas de `function` declarations
- Zéro React dans l'engine — code pur (calculs, canvas)
- Rendu canvas dans la classe : instance pour le rendu contextualisé, `static` pour le générique
- Pas de magic numbers — constantes depuis `colors.ts` ou `constants.ts`
- Durées animation en `static readonly` ms sur la classe, step = `1000 / (duration * FPS)`

## Anchor key

Format universel : `"${lineId}::${anchor}"` → utilisé dans activePaths, arrivalPaths, painterMap, allPaths.

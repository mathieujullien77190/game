# engine/ — moteur du jeu

Calcul + dessin de la simulation (preview) et de l'éditeur. **Zéro React, zéro DOM** → portable (éditeur web + WebView mobile). Tout le dessin cible l'interface `Renderer` (`render/Renderer.ts`).

## Structure
- `entities/` — entités métier (pattern Base → Editor / Preview, voir `entities/CLAUDE.md`).
- `Manager/` — `EditorManager` (édition) / `PreviewManager` (simulation + rendu).
- `Map/` — `mapJson` (format + (dé)sérialisation), `loadPreview` (`buildPreviewManager`).
- `render/Renderer.ts` — interface de rendu (sous-ensemble de l'API canvas 2D, sans type DOM).
- `Utils/` — `geometry`, `numeric`, `anim` (helpers d'animation).
- `types.ts`, `constants.ts`, `theme.ts` — types partagés, constantes, couleurs/épaisseurs/rayons.
- `Profiler.ts` — mesure de perf par passe (voir plus bas).

## Règles
- Tout en **arrow functions** — pas de `function`.
- **Zéro React, zéro DOM** (`tsconfig` sans lib DOM) — pas de `document`/`window`.
- Pattern **Base → Editor / Preview** : la base n'a jamais de `draw` ; les managers n'instancient que les `*Editor` / `*Preview`.

## Thème
`theme.ts` : `COLORS` et `STROKE_WIDTHS` sont **mutables** — un frontend peut les remplacer à l'exécution via `applyTheme(colors, strokes?)` / `resetTheme()` (l'app mobile passe en palette « Calque », l'éditeur garde les valeurs par défaut). Les entités lisent `COLORS.x` / `STROKE_WIDTHS.x` au moment du draw → toute couleur statique doit passer par `COLORS` (pas de littéral) et **ne jamais capturer** une de ces valeurs dans une constante de module. Tokens par composant (preview) : `rail`, `gate`, `arrivalRing`, `arrivalProgress`, `switchAccent` / `switchAutoAccent` (vide = couleur de la map), épaisseurs `rail` / `gate` ; défauts = rendu historique. `COLORS.background` = fond du canvas de simulation (`"transparent"` possible).

## Événements de simulation
`Manager/simEvents.ts` (`SimEvent`) : la simulation empile des événements (`arrival` ok/ko avec la demande attendue, `collision`) dans `PreviewManager.data.events` ; le frontend les consomme avec `pm.drainEvents()`. L'engine ne décide pas de la victoire/défaite.

## Profiler
Singleton de mesure par passe, désactivé par défaut, horloge injectable (`setClock`). Gardé par la constante de build `__TICTACTIC_PROFILING__` (injectée par chaque `vite.config.ts`) : `true` en édition, `false` en mobile → la classe entière est éliminée (dead-code) du bundle mobile.

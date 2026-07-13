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

## Profiler
Singleton de mesure par passe, désactivé par défaut, horloge injectable (`setClock`). Gardé par la constante de build `__DRIFT_PROFILING__` (injectée par chaque `vite.config.ts`) : `true` en édition, `false` en mobile → la classe entière est éliminée (dead-code) du bundle mobile.

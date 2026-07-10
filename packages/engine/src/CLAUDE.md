# Conventions de l'engine

## Règles

- Tout en arrow functions — pas de `function` declarations
- Zéro React dans l'engine — code pur (calculs, dessin)
- **Zéro DOM** : les `draw(ctx, …)` ciblent l'interface `Renderer` (`render/Renderer.ts`), jamais `CanvasRenderingContext2D`. `tsconfig` sans lib DOM. Pas de `document`/`window`. → engine portable (Skia/RN plus tard)

## Pattern classes : Base → Editor / Preview

Chaque entité métier suit ce schéma à 3 niveaux :

```
Token          ← base : data pure (id, color, speed, type…), pas de draw
  TokenPreview ← draw pour le canvas preview (simulation)
  TokenEditor  ← draw pour le canvas editor (si besoin)

Line           ← base : data pure (start, end, points, computePoints)
  LinePreview  ← draw pour le canvas preview
  LineEditor   ← draw pour le canvas editor (dashed, endpoints, id)
```

**Règles du pattern :**
- La classe de base ne contient **jamais** de méthode `draw`
- `*Preview` → draw pour la simulation (couleurs réelles, rendu final)
- `*Editor` → draw pour l'éditeur (dashed, handles, overlays)
- Les Managers instancient les classes `*Preview` / `*Editor`, jamais la base directement
- `PreviewManager` travaille exclusivement avec `*Preview`
- `EditorManager` travaille exclusivement avec `*Editor`

## Organisation

```
engine/
  Line/
    Line.ts          ← base
    LineEditor.ts    ← extend Line, draw editor
    LinePreview.ts   ← extend Line, draw preview
  Token/
    Token.ts         ← base
    TokenPreview.ts  ← extend Token, draw preview
  Manager/
    Manager.ts       ← base générique
    EditorManager.ts ← orchestre *Editor
    PreviewManager.ts← orchestre *Preview
  Link/
  types.ts
  constants.ts
  Profiler.ts        ← singleton de mesure de perf, voir ci-dessous
```

## Profiler (`Profiler.ts`)

Singleton de mesure de temps par étape, désactivé par défaut (`enabled = false`). Zéro DOM : l'horloge par défaut est `Date.now`, injectable via `Profiler.setClock(fn)` — `edition` branche `performance.now` (précision sous-ms) au chargement de `hooks/useCanvasDrawPreview.ts`.

- `Profiler.start(label)` / `Profiler.end(label)` : encadrent une passe, accumulent une fenêtre glissante (60 échantillons) par label.
- `Profiler.getStats()` : moyenne + `%` du total mesuré par label, triés décroissant.
- `Profiler.reset()` : vide l'historique — appelé par `PreviewManager.initSimulation` (donc à chaque (re)lancement de la preview, cf. `Manager/CLAUDE.md`).

**Élimination en prod (pas juste désactivé — absent du bundle mobile) :** tous les appels `Profiler.*` dans `PreviewManager.ts` sont gardés par une constante de build `PROFILING` (`typeof __DRIFT_PROFILING__ !== "undefined" && __DRIFT_PROFILING__`, déclarée en `declare global` juste au-dessus). `__DRIFT_PROFILING__` est injecté par `define` dans chaque `vite.config.ts` :
- `edition/vite.config.ts` → `true` (onglet perf actif)
- `app/webview/vite.config.ts` → `false` — Vite/esbuild replie chaque `if (PROFILING) Profiler.xxx(...)` en `if (false) ...` puis l'élimine (dead-code), et l'import de `Profiler` devient inutilisé → **la classe `Profiler` entière disparaît du bundle mobile**, pas seulement son exécution. Vérifié empiriquement (`node packages/app/scripts/build-preview.mjs` puis grep sur `src/previewHtml.ts` : zéro occurrence de `Profiler`/`__DRIFT_PROFILING__`).
- Le `typeof` protège tout consommateur qui n'injecterait pas `__DRIFT_PROFILING__` (pas de `ReferenceError`, profiling silencieusement inactif).
- `Metro` (bundler RN de `App.tsx`) ne touche jamais `PreviewManager.ts` — `app` ne charge le moteur que via le HTML pré-buildé par Vite (`previewHtml.ts`), donc `__DRIFT_PROFILING__` n'a besoin d'exister que dans les deux configs Vite ci-dessus.
- `Profiler.setEnabled(bool)` : activé/désactivé côté `edition` sur `setViewMode` (`store/actions/modeActions.ts`) — enregistre pendant `"preview"`, gèle les valeurs en repassant en `"editor"` (consultées dans l'onglet Perf).

# Drift — Level Editor

## Le jeu

Drift est un jeu de routage de balles inspiré d'Inception : les tokens (balles colorées) voyagent sur des lignes, traversent des **screen gates** pour entrer dans des écrans imbriqués (comme des niveaux de rêve) où le temps s'écoule différemment (`screenTimeMultipliers`), changent de couleur/forme via des transformers, et doivent atteindre l'arrivée dans le bon état.

Mode **editor** : l'utilisateur dessine des lignes, place des entités (start, arrival, switch, transformer, inverter, screen gate), configure les links, importe/exporte le JSON.
Mode **preview** : simulation en temps réel des tokens sur le canvas.

## Stack

Vite + React + TypeScript + Zustand + styled-components. Canvas 2D pur, pas de lib de rendu.
**Monorepo yarn workspaces** (`packages/*`). Packages consommés en source (pas de build par package) — Vite bundle le TS directement.

## Packages

Deux **libs** partagées (engine, game) + un package **data** (maps) + les adaptateurs de rendu + deux **frontends** : `edition` (web) et `app` (mobile). `edition` = éditeur web, `app` = jeu React Native. Aucun lien edition↔app.

```
packages/
  engine/   → moteur : précalcul + draw preview ET editor (base + *Editor + *Preview + les 2 Managers) + Map/ (mapJson, loadPreview) + render/Renderer. Zéro React, **zéro DOM** (portable RN). [lib]
  game/     → helpers web preview (canvas) : PreviewCanvas + useCanvasDrawPreview + screenEffects. Utilisé par edition. Dépend de engine + canvas-render. [lib web]
  maps/     → données : map.json (une seule map pour l'instant, plusieurs à terme). [data]
  canvas-render/ → Canvas2DRenderer : implémente Renderer en enveloppant un CanvasRenderingContext2D. Utilisé par edition + game. [lib web]
  skia-render/ → SkiaRenderer : implémente Renderer au-dessus d'un SkCanvas (react-native-skia). Utilisé par app. [lib RN]
  edition/  → **frontend ÉDITEUR (web)** : store/, components/, hooks/useCanvasDraw, App/GlobalStyle + host Vite. Édite map.json + preview intégrée. Dépend de engine + game + canvas-render + maps.
  app/      → **frontend JEU (React Native, Expo + Skia)** : charge map.json, tick la sim, dessine via SkiaRenderer. Même rendu que la preview de edition. Dépend de engine + skia-render + maps. [run sur device/émulateur]
```

- `edition` = web (Vite), `app` = mobile (Expo/Metro). Aucune version web du jeu (supprimée) : le jeu, c'est `app` (mobile).
- Le `previewManager` est instancié dans le store (edition) et passé en prop à `<PreviewCanvas>` de game → game n'importe jamais le store (pas de cycle).
- Les boutons Restart/Pause de la preview restent dans edition (Restart appelle `setViewMode` du store, qui reconstruit la simulation).

## Rendering — abstraction Renderer (multi-backend)

- Tout le draw de l'engine cible l'interface **`Renderer`** (`engine/src/render/Renderer.ts`) — un sous-ensemble de l'API canvas 2D avec des types propres, **zéro type DOM**. `engine/tsconfig.json` force `lib: ["ES2023"]` (sans DOM) → l'engine est portable (React Native possible).
- **2 adaptateurs explicites** implémentent `Renderer` (symétriques), **zéro draw dupliqué** :
  - `@drift/canvas-render` → **`Canvas2DRenderer`** (web) : enveloppe un `CanvasRenderingContext2D`, délégation directe. Utilisé par `edition/hooks/useCanvasDraw` (`drawAll`) et `game/hooks/useCanvasDrawPreview` (`drawAllPreview`).
  - `@drift/skia-render` → **`SkiaRenderer`** (RN) : enveloppe un `SkCanvas` (react-native-skia), émule le Canvas 2D stateful (path courant, pile de styles, matrice trackée pour `setTransform`). Utilisé par `app` (mobile).
- L'implémentation d'un renderer **ne peut pas** vivre dans engine (elle référence un type de plateforme : `CanvasRenderingContext2D` / `SkCanvas`) → package séparé par plateforme. Seul le contrat est dans engine. Ajouter une plateforme = 1 nouvel adaptateur.
- Le root `tsconfig` **exclut** `skia-render` et `app` (types RN/Skia/Expo). Typecheck : `tsc -p packages/skia-render/tsconfig.json`. `canvas-render` est inclus dans le typecheck web.
- Les **effets plein écran** (inverter / grayscale / dark) restent **web-only** dans `game/src/screenEffects.ts` (offscreen canvas, compositing, `document`). L'engine ne fournit que l'état sim (`data.isInverted/isGrayscale/isDark`). `applyScreenEffects(ctx, pm)` est appelé après `drawAllPreview`. Un backend Skia refera son propre effet (déféré).

## map.json — source de vérité unique

- **Format + (dé)sérialisation** : `@drift/engine/Map/mapJson` (`MapJson`, `serializeMap`, `deserializeMap`). `@drift/engine/Map/loadPreview` (`buildPreviewManager(json)` → PreviewManager prêt à simuler ; `populatePreviewLines` partagé avec l'aperçu éditeur).
- **edition** : charge `map.json` au démarrage (seed bundlé), puis **réécrit `packages/maps/map.json` à chaque changement**, 100% auto. Le store `subscribe` → autosave debounced (400ms, skip si contenu identique) → `POST /__save-map` (`edition/src/saveMap.ts`). Le plugin Vite dev `drift-save-map` (`edition/vite.config.ts`) écrit le fichier côté serveur. **Dev only** (le write passe par le serveur dev). **Plus de localStorage, plus de geste utilisateur.**
- **app** (mobile) : `import map from "@drift/maps/map.json"` (Metro) → `buildPreviewManager(map)` → boucle rAF `tickSim` + `pm.drawAllPreview(new SkiaRenderer(cv, W, H))`.
- Boucle : éditer dans edition → `map.json` réécrit → app (Metro) recharge la map au reload.

## Scripts (racine)

- `yarn edition` → frontend éditeur web (Vite dev)
- `yarn app` → jeu mobile (Expo start, dev-client) — run sur device/émulateur, voir `packages/app/README.md`
- `yarn lint` → eslint monorepo

## Imports

- Cross-package : nom du package. Ex : `import { EditorManager } from "@drift/engine/Manager/EditorManager"`, `import { PreviewCanvas } from "@drift/game"`.
- Intra-package `edition` : alias `store/`, `hooks/`, `components/`.
- Intra-package : `./` dans le même dossier, sinon alias.
- Aliases déclarés en double : `tsconfig.base.json` (`paths`, typecheck) **et** le `vite.config.ts` de chaque frontend (`resolve.alias`, bundling). `edition` mappe engine+game+store/hooks/components ; `app` mappe seulement engine+game. Garder synchronisés.

## Règles globales

- Tout en **arrow functions** — jamais de `function` declarations
- Zéro React dans `engine/` — code pur (calculs, canvas uniquement)
- Pas de styles inline ni fichiers `.css` — tout dans `UI.tsx` via styled-components

## Engine — pattern Base → Editor / Preview

Chaque entité suit ce schéma à 3 niveaux :

```
Foo          ← base : data pure, pas de draw, pas de React
  FooEditor  ← draw éditeur (dashed, handles, overlays), utilisé par EditorManager
  FooPreview ← draw simulation (couleurs réelles), utilisé par PreviewManager
```

- La classe de base ne contient **jamais** de méthode `draw`
- `EditorManager` instancie uniquement les `*Editor`
- `PreviewManager` instancie uniquement les `*Preview`

## Engine — mécanique des links

Les links sont **auto-générés** par `EditorManager.addLine()` quand deux endpoints coïncident.
ID d'un link : `${line1.id}::${line1.endpoint}-${line2.id}::${line2.endpoint}` (line1 = ligne déjà présente, line2 = ligne ajoutée).
L'ordre du tableau `lines` dans le JSON fixe donc les IDs des links — critique pour nommer les composants (transformer, inverter, switch, gate) par leur `linkId`.

## Engine — simulation (PreviewManager)

- Un seul `start` est utilisé (`Object.values(starts)[0]`)
- Tous les tokens spawent depuis ce start, `startAt = (i+1) * start.delay` secondes
- Un **transformer** sur un link arrête le token le temps de la transformation (`PAINT_DURATION`)
- Un **inverter** inverse les couleurs du canvas (effet `difference`)
- Un **switch** au nœud : contrôle quelle branche est active ; le joueur clique pour cycler
- Un **screen gate** téléporte le token vers un autre écran ; `screenTimeMultipliers[screenId]` contrôle la vitesse relative
- L'**arrival** doit avoir des `demands` dont la `color` ET le `type` correspondent exactement au token à l'arrivée

## Store (Zustand)

- Toujours `useShallow` pour destructurer plusieurs valeurs — sinon boucle infinie
- Actions : factory functions `(set: Set) => (...args) => set(state => ({...}))`
- Persistence : `map.json` via plugin Vite dev (voir section « map.json »). Chargement initial + `loadMap(json)` action (`store/actions/mapActions.ts`, `EMPTY_MAP`) ; autosave dans `store/useStore.ts` (`saveMap` → POST). **Pas de localStorage.**
- Le type `Set` est défini dans `store/types.ts`

## Composants React

```
ComponentName/
  ComponentName.tsx   → composant, arrow function, export nommé
  UI.tsx              → tous les styled-components (import * as S)
  index.ts            → re-export default
```

- Props transientes préfixées `$` : `<S.Button $active={true}>`
- `createGlobalStyle` dans `packages/edition/src/GlobalStyle.tsx`, monté dans `App.tsx`
- Hint utilisateur contextuel : overlay canvas, pas dans le panneau d'outils
- Composants form réutilisables : `Field`, `NumberInput`, `ColorPicker`, `TagLine`, `TagLink`
- Composants ui réutilisables : `Tag`, `Button`

## Hooks

- Dans `src/hooks/`, préfixés `use`, un fichier par hook, export nommé
- `useState` si re-render nécessaire, `useRef` si mutation sans re-render

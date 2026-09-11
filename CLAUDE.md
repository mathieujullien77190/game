# Tic-Tac-Tic — Level Editor

## Le jeu

Tic-Tac-Tic est un jeu de routage de balles inspiré d'Inception : les tokens (balles colorées) voyagent sur des lignes, traversent des **screen gates** pour entrer dans des écrans imbriqués (comme des niveaux de rêve) où le temps s'écoule différemment (`screenTimeMultipliers`), changent de couleur/forme via des transformers, et doivent atteindre l'arrivée dans le bon état.

Mode **editor** : l'utilisateur dessine des lignes, place des entités (start, arrival, switch, transformer, inverter, screen gate), configure les links, importe/exporte le JSON.
Mode **preview** : simulation en temps réel des tokens sur le canvas.

## Stack

Vite + React + TypeScript + Zustand + styled-components. Canvas 2D pur, pas de lib de rendu.
**Monorepo yarn workspaces** (`packages/*`). Packages consommés en source (pas de build par package) — Vite bundle le TS directement.

## Packages

Une **lib** partagée (engine) + un package **data** (maps) + le backend de rendu web (`canvas-render`) + deux **frontends** : `edition` (web) et `app` (mobile). `edition` = éditeur web, `app` = jeu React Native. Aucun lien edition↔app.

```
packages/
  engine/   → moteur : précalcul + draw preview ET editor (base + *Editor + *Preview + les 2 Managers) + Map/ (mapJson, loadPreview) + render/Renderer. Zéro React, **zéro DOM** (portable RN). [lib]
  maps/     → données : map.json (une seule map pour l'instant, plusieurs à terme). [data]
  canvas-render/ → Canvas2DRenderer (implémente Renderer sur un CanvasRenderingContext2D) + screenEffects (effets plein écran web). Utilisé par edition ET le bundle webview de app. Point d'extension pour un futur backend (SVG…). [lib web]
  edition/  → **frontend ÉDITEUR (web)** : store/, components/ (dont PreviewCanvas), hooks/ (useCanvasDraw + useCanvasDrawPreview), App/GlobalStyle + host Vite. Édite map.json + preview intégrée. Dépend de engine + canvas-render + maps.
  app/      → **frontend JEU (React Native, Expo)** : coquille RN qui héberge une **WebView** faisant tourner la preview de l'engine en **canvas2d** (webview/main.ts, bundlé single-file dans src/previewHtml.ts). Map injectée par RN. Dépend de engine + canvas-render + maps. [run sur device/émulateur]
```

- `edition` = web (Vite), `app` = mobile (Expo/Metro). Aucune version web du jeu (supprimée) : le jeu, c'est `app` (mobile). L'ancien package `game` (helpers web preview) → fusionné dans `edition`. Un package `skia-render` (backend react-native-skia) a existé puis été **supprimé** : Skia était ~5× plus lent que canvas2d sur device réel (une traversée JS→natif par primitive), donc `app` est repassé sur canvas2d via WebView.
- Le `previewManager` est instancié dans le store (edition) et passé en prop à `<PreviewCanvas>` → PreviewCanvas n'importe jamais le store (pas de cycle).
- Le `previewManager` est instancié dans le store (edition) et passé en prop à `<PreviewCanvas>` → PreviewCanvas n'importe jamais le store (pas de cycle).
- Les boutons Restart/Pause de la preview restent dans edition (Restart appelle `setViewMode` du store, qui reconstruit la simulation).

## Rendering — abstraction Renderer + WebView mobile

- Tout le draw de l'engine cible l'interface **`Renderer`** (`engine/src/render/Renderer.ts`) — un sous-ensemble de l'API canvas 2D avec des types propres, **zéro type DOM**. `engine/tsconfig.json` force `lib: ["ES2023"]` (sans DOM) → l'engine reste portable. L'abstraction permet d'ajouter un backend (SVG…) sans toucher l'engine.
- **Un seul adaptateur** aujourd'hui : `@tic-tac-tic/canvas-render` → **`Canvas2DRenderer`** : enveloppe un `CanvasRenderingContext2D`, délégation directe. Utilisé par `edition/hooks/useCanvasDraw` (`drawAll`), `edition/hooks/useCanvasDrawPreview` (`drawAllPreview`), **et** `app/webview/main.ts` (même code, dans la WebView).
- **Mobile (`app`)** : pas de rendu natif. `App.tsx` = une `<WebView>` (`react-native-webview`) qui charge `src/previewHtml.ts` — un HTML single-file (build Vite de `webview/`, cf. `scripts/build-preview.mjs`) contenant engine + Canvas2DRenderer + la boucle rAF. La map est passée via `injectedJavaScriptBeforeContentLoaded` (`window.__TICTACTIC_MAP__`) → changer la map ne nécessite **pas** de rebuild le bundle web (juste reload l'app). Rebuild `build:preview` seulement quand l'engine / le renderer / `main.ts` changent.
- **Page d'accueil** : `#home` dans `webview/index.html` (HTML/CSS pur, pas de React). Tant qu'elle est affichée, le niveau est dessiné une seule fois (figé, flouté) et la boucle rAF ne tourne pas ; « Jouer » la retire et lance la simulation (`main.ts`). Web et mobile (même bundle).
- Le System WebView Android (Chromium HW-accéléré) rend le canvas2d bien plus vite que Skia ne le faisait sur device (~200 tokens/60fps vs ~15).
- Les **effets plein écran** (inverter / grayscale / dark) vivent dans `canvas-render/src/screenEffects.ts` (offscreen canvas, compositing, `document`). L'engine ne fournit que l'état sim (`data.isInverted/isGrayscale/isDark`). `applyScreenEffects(ctx, pm)` est appelé après `drawAllPreview` — par edition ET par le bundle webview (parité web/mobile).
- Le root `tsconfig` **exclut** `app` (types RN/Expo). `app` a son propre typecheck (`packages/app/tsconfig.json` pour App.tsx, `packages/app/webview/tsconfig.json` pour le bundle web). `canvas-render` est inclus dans le typecheck web.

## map.json — source de vérité unique

- **Format + (dé)sérialisation** : `@tic-tac-tic/engine/Map/mapJson` (`MapJson`, `serializeMap`, `deserializeMap`). `@tic-tac-tic/engine/Map/loadPreview` (`buildPreviewManager(json)` → PreviewManager prêt à simuler ; `populatePreviewLines` partagé avec l'aperçu éditeur).
- **edition** : charge `map.json` au démarrage (seed bundlé), puis **réécrit `packages/maps/map.json` à chaque changement**, 100% auto. Le store `subscribe` → autosave debounced (400ms, skip si contenu identique) → `POST /__save-map` (`edition/src/saveMap.ts`). Le plugin Vite dev `tic-tac-tic-save-map` (`edition/vite.config.ts`) écrit le fichier côté serveur. **Dev only** (le write passe par le serveur dev). **Plus de localStorage, plus de geste utilisateur.**
- **app** (mobile) : `import map from "@tic-tac-tic/maps/map.json"` (Metro) → `buildPreviewManager(map)` → boucle rAF `tickSim` + `pm.drawAllPreview(new SkiaRenderer(cv, W, H))`.
- Boucle : éditer dans edition → `map.json` réécrit → app (Metro) recharge la map au reload.

## Scripts (racine)

- `yarn edition` → frontend éditeur web (Vite dev)
- `yarn app` → jeu mobile (Expo start, dev-client) — run sur device/émulateur, voir `packages/app/README.md`
- `yarn app:web` → visu web de l'app dans le navigateur (Vite dev sur `app/webview`, même bundle que la WebView). Map injectée depuis `maps/map.json` (plugin dev `tic-tac-tic-inject-map`), page rechargée à chaque modif de la map
- `yarn lint` → eslint monorepo

## Imports

- Cross-package : nom du package. Ex : `import { EditorManager } from "@tic-tac-tic/engine/Manager/EditorManager"`, `import { PreviewCanvas } from "@tic-tac-tic/game"`.
- Intra-package `edition` : alias `store/`, `hooks/`, `components/`.
- Intra-package : `./` dans le même dossier, sinon alias.
- Aliases déclarés en double : `tsconfig.base.json` (`paths`, typecheck) **et** le `vite.config.ts` de chaque frontend (`resolve.alias`, bundling). `edition` mappe engine+game+store/hooks/components ; `app` mappe seulement engine+game. Garder synchronisés.

## Règles globales

- **Répondre en français** — toujours (le code, commits, PRs suivent la convention du repo)
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

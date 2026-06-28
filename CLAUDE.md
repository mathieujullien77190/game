# Tickwire — Level Editor

## Le jeu

Tickwire est un jeu de routage de balles : les tokens (balles colorées) voyagent sur des lignes, traversent des **screen gates** pour entrer dans des écrans imbriqués où le temps s'écoule différemment (`screenTimeMultipliers`), changent de couleur/forme via des transformers, et doivent atteindre l'arrivée dans le bon état.

Mode **editor** : l'utilisateur dessine des lignes, place des entités (start, arrival, switch, transformer, inverter, screen gate), configure les links, importe/exporte le JSON.
Mode **preview** : simulation en temps réel des tokens sur le canvas SVG.

## Stack

Vite + React + TypeScript + Zustand + styled-components. Rendu SVG pur (`packages/engine/src/` génère du JSX SVG), pas de lib de rendu.

## Imports

- Alias obligatoires sauf `./` dans le même dossier
- Alias configurés : `engine/`, `store/`, `hooks/`, `components/`
- Exemple : `import { EditorManager } from "engine/Manager/EditorManager"`

## Organisation

```
src/
  engine/       → logique pure, SVG JSX, classes métier (zéro React hooks)
  store/        → Zustand, state global, persistence localStorage
  hooks/        → hooks React (useCanvasDraw, etc.)
  components/   → React UI, LevelEditor, ToolsPanel, tabs/
```

## Règles globales

- Tout en **arrow functions** — jamais de `function` declarations
- Zéro React hooks dans `engine/` — code pur (calculs, JSX SVG uniquement)
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
- Un **inverter** inverse les couleurs du canvas
- Un **switch** au nœud : contrôle quelle branche est active ; le joueur clique pour cycler
- Un **screen gate** téléporte le token vers un autre écran ; `screenTimeMultipliers[screenId]` contrôle la vitesse relative
- L'**arrival** doit avoir des `demands` dont la `color` ET le `type` correspondent exactement au token à l'arrivée

## Engine — rendu SVG des lignes

- `LinePreview` rend les lignes comme `<path>` SVG avec stroke
- `lineFilledPath()` dans `lineUtils.ts` génère un polygon outline rempli (alternative sans stroke, meilleur antialiasing sur certains OS)
- `SvgPreviewCanvas` : SVG `width/height 100%` avec `minWidth/minHeight = CANVAS_W/H` — remplit le container, scroll si viewport trop petit

## Engine — entités interactives (mobile)

- Les entités `*Preview` exposent `hitTest(x, y)` pour la détection de clic
- `HIT_RADIUS` peut être supérieur au rayon visuel pour agrandir la zone de tap sur mobile — ne pas confondre les deux constantes

## Store (Zustand)

- Toujours `useShallow` pour destructurer plusieurs valeurs — sinon boucle infinie
- Actions : factory functions `(set: Set) => (...args) => set(state => ({...}))`
- Persistence localStorage clé `"game2-map"` via `serializeMap` / `deserializeMap` (`store/mapJson.ts`)
- Si localStorage vide → charge `DEFAULT_MAP` (`store/defaultMap.ts`)
- Le type `Set` est défini dans `store/types.ts`

## Composants React

```
ComponentName/
  ComponentName.tsx   → composant, arrow function, export nommé
  UI.tsx              → tous les styled-components (import * as S)
  index.ts            → re-export default
```

- Props transientes préfixées `$` : `<S.Button $active={true}>`
- `createGlobalStyle` dans `src/GlobalStyle.tsx`, monté dans `App.tsx`
- Hint utilisateur contextuel : overlay canvas, pas dans le panneau d'outils
- Composants form réutilisables : `Field`, `NumberInput`, `ColorPicker`, `TagLine`, `TagLink`
- Composants ui réutilisables : `Tag`, `Button`

## Hooks

- Dans `src/hooks/`, préfixés `use`, un fichier par hook, export nommé
- `useState` si re-render nécessaire, `useRef` si mutation sans re-render

## Layout global (game)

- `body` : conteneur centré avec fond sombre — isole l'app sur desktop
- `#root` : largeur max phone, hauteur 100% — le jeu est centré tel une app mobile
- `-webkit-tap-highlight-color: transparent` global — supprime le flash bleu sur mobile

## Editor

- Canvas fixe `CANVAS_W × CANVAS_H` px, pas de scale dynamique
- `CanvasArea` overflow auto — scroll si le panel est plus petit que le canvas
- Panneau gauche redimensionnable par drag (divider)

## Logo

- `TickwireLogo` : SVG statique, angles calculés depuis l'heure réelle au montage — pas d'animation
- Taille contrôlée par prop `size` (px) ou `100%` par défaut
- `LogoWrap` dans l'écran d'accueil : capé à une largeur max pour ne pas déborder sur desktop

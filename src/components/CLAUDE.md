# Conventions des composants

## Structure

```
ComponentName/
  ComponentName.tsx   → composant (arrow function, export nommé)
  UI.tsx              → tous les styled-components
  types.ts            → types TypeScript + enums
  constants.ts        → constantes
  helpers.ts          → fonctions utilitaires
  index.ts            → export { ComponentName as default } from "./ComponentName"
```

`types.ts`, `constants.ts` et `helpers.ts` sont optionnels.

## Dossiers génériques

```
components/
  ui/        → primitives d'affichage réutilisables (Tag, Button, TagLine, TagLink…)
  form/      → contrôles de formulaire réutilisables (Field, NumberInput, ColorPicker…)
  tabs/      → onglets du panneau d'outils (LineTab, StartTab, BallTab, SwitchTab, PainterTab…)
```

## Composants form

- `Field` — label (10px monospace gris, uppercase) au-dessus d'un children quelconque
- `NumberInput` — accepte `label?` : se wrape dans `Field` si fourni
- `ColorPicker` — accepte `label?` : se wrape dans `Field` si fourni, prend `palette`, `value`, `onChange`
- `TagLine` — badge affichant `lineId [anchor]`, prop `selected` pour état actif
- `TagLink` — badge affichant un linkId

## Règles

- Tout en arrow functions
- Tous les styles dans `UI.tsx` — import `* as S from "./UI"`, usage `<S.Wrapper>`
- Props transientes préfixées `$` : `<S.Button $active={true}>`
- Pas de styles inline ni de fichiers `.css`
- `createGlobalStyle` dans `src/GlobalStyle.tsx`, monté dans `App.tsx`
- Hint utilisateur contextuel en overlay sur le canvas, pas dans le panneau d'outils

## Pattern : ajouter une entité (ex: Painter)

1. **Tab** `components/tabs/EntityTab/` — bouton Add/Cancel + liste avec `ItemRow` + `onMouseEnter/Leave` pour hover
2. **ToolsPanel** — ajouter `{ id: "entity", label: "Entity" }` dans `TABS` + import + render conditionnel
3. **ToolsPanel/types.ts** — ajouter `"entity"` au type `Tab`
4. **LevelEditor** — destructurer `entities`, `addEntity`, `hoveredEntityId` du store ; ajouter dans `levelJSON` useMemo ; ajouter bloc `else if (mode === "addEntity")` dans `handleMouseUp` ; passer `hoveredEntityId` à `useCanvasDraw`
5. **useCanvasDraw** — ajouter param `hoveredEntityId`, passer à `manager.drawAll`

## LevelEditor : flow entier

```
store (painters[]) → levelJSON useMemo → EditorManager → useCanvasDraw → canvas
                                       → PreviewManager (useState) → useCanvasDrawPreview
```

`previewManager` en `useState` (pas `useRef`) — doit déclencher re-render du hook.
`window.previewManager = previewManager` exposé pour debug console.

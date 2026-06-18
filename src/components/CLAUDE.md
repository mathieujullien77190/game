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
  ui/        → primitives d'affichage réutilisables (Tag, Button…)
  form/      → contrôles de formulaire réutilisables (Field, NumberInput, ColorPicker…)
  tabs/      → onglets du panneau d'outils (LineTab, StartTab, BallTab…)
```

## Composants form

- `Field` — label (10px monospace gris, uppercase) au-dessus d'un children quelconque. À utiliser comme wrapper pour tout champ nommé.
- `NumberInput` — accepte `label?` : si fourni, se wrape automatiquement dans `Field`.
- `ColorPicker` — accepte `label?` : si fourni, se wrape automatiquement dans `Field`.

Tout composant générique va dans `ui/` ou `form/` selon sa nature.
Les onglets vont dans `tabs/`.
Les composants métier restent à la racine de `components/`.

## Règles

- Tout en arrow functions
- Tous les styles dans `UI.tsx` — import `* as S from "./UI"`, usage `<S.Wrapper>`
- Props transientes préfixées `$` : `<S.Button $active={true}>`
- Pas de styles inline ni de fichiers `.css`
- `createGlobalStyle` dans `src/GlobalStyle.tsx`, monté dans `App.tsx`
- Hint utilisateur contextuel en overlay sur le canvas, pas dans le panneau d'outils

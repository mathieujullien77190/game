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
  ui/        → primitives d'affichage réutilisables (Button, ToggleGroup, DeleteButton, Card, Divider, TokenShape)
  form/      → contrôles de formulaire réutilisables (Field, NumberInput, ColorPicker, Checkbox)
  tabs/      → onglets du panneau d'outils (LineTab, StartTab, SwitchTab, TransformerTab, InverterTab, ArrivalTab, ScreenGateTab, JsonTab, PerfTab)
```

Ces deux dossiers existent pour absorber les patterns **réellement dupliqués** entre onglets (bouton "+ Add X", groupe de bascule actif/inactif, carte d'entité, ✕ supprimer, champ numérique/select/checkbox). Ce qui reste spécifique à un onglet (ex: le bloc ligne expansible de `LineTab`, les badges de `LineTab`) reste local à son `UI.tsx` — ne pas forcer une abstraction générique dessus.

## Composants ui

- `Button` — bouton à bascule générique. Props `$active?`, `$accent?` (couleur de fond/bordure à l'état actif, défaut `#333`), `$full?` (largeur 100%, look CTA majuscule — pour les "+ Add X"), `$size?: "sm" | "md"`. Chaque onglet passe sa propre couleur d'accent.
- `ToggleGroup` — wrapper flex autour de plusieurs `Button` formant un groupe de bascule. Props `$wrap?` (flex-wrap, pour les listes de taille variable), `$equal?` (boutons à largeur égale, `flex:1`).
- `DeleteButton` — le ✕ de suppression, prop `$size?` (px, défaut 12).
- `Card` — carte d'entité (fond gris clair, bordure, radius). Props `$accent?` (bordure gauche colorée 3px), `$nested?` (variante plus sombre/compacte pour une carte imbriquée dans une autre, ex: un token dans un start).
- `Divider` — `<hr>` gris fin.
- `TokenShape` — glyphe rond/carré coloré représentant un token.

## Composants form

- `Field` — label (10px monospace gris, uppercase) au-dessus d'un children quelconque par défaut ; `$direction="row"` pour un label à gauche (utilisé en interne par `NumberInput`, et explicitement par les onglets pour aligner label+`ToggleGroup`/`ColorPicker`).
- `NumberInput` — accepte `label?` : se wrape dans `Field` (`row`) si fourni. `min?`/`max?`/`step?`. `commitOn?: "change" | "blur"` (défaut `"change"` = valeur remontée à chaque frappe ; `"blur"` = bufferisé localement et remonté à la perte de focus, nécessaire pour les champs décimaux — sinon la resynchronisation du contrôle sur `value` écrase une saisie du type `"0."` en cours de frappe). Encadré de 4 `StepButton` (`−1`/`−.1`/`+.1`/`+1`) qui appliquent directement `onChange` (indépendants du `step` de l'input), désactivés à `min`/`max`.
- `ColorPicker` — prend `palette`, `value`, `onChange`, `onClear?` (pas de `label` — toujours utilisé avec un label externe posé par l'appelant, généralement via `Field`).
- `Checkbox` — checkbox stylée, `checked`/`onChange(checked)`.

Pas de `<select>` HTML dans l'éditeur — tout choix parmi une liste (écran cible, ligne d'entrée/sortie…) passe par `Field` + `ToggleGroup` de `Button`, comme les autres champs à choix (type, mode…), avec un `S.NoOptions`/équivalent quand la liste est vide.

## Règles

- Tout en arrow functions
- Tous les styles dans `UI.tsx` — import `* as S from "./UI"`, usage `<S.Wrapper>`
- Props transientes préfixées `$` : `<S.Button $active={true}>`
- Pas de styles inline ni de fichiers `.css`
- `createGlobalStyle` dans `src/GlobalStyle.tsx`, monté dans `App.tsx`
- Hint utilisateur contextuel en overlay sur le canvas, pas dans le panneau d'outils



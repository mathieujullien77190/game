---
name: new-component
description: Scaffold un composant React de l'éditeur (packages/edition) selon la convention du repo — dossier ComponentName/ avec ComponentName.tsx, UI.tsx (styled-components), types.ts (types + enums, dont Props), index.ts. Déclencheurs — "nouveau composant", "créer un composant edition", "scaffold component", "ajouter un panneau/bouton dans l'éditeur".
---

# new-component

Crée un composant React de l'éditeur en respectant la convention du CLAUDE.md. Demander le **nom** (PascalCase) et son rôle. Emplacement par défaut : `packages/edition/src/components/<Name>/`.

## Structure

```
packages/edition/src/components/<Name>/
  <Name>.tsx    → le composant, arrow function, export nommé
  UI.tsx        → TOUS les styled-components (import * as S)
  types.ts      → types TypeScript + enums (dont les Props)          [optionnel]
  constants.ts  → constantes                                          [optionnel]
  helpers.ts    → fonctions utilitaires                               [optionnel]
  index.ts      → export { <Name> as default } from "./<Name>"
```

`types.ts` / `constants.ts` / `helpers.ts` ne sont créés **que s'il y a du contenu** à y mettre. Dès qu'il y a des types (Props comprises) ou des enums, ils vont dans `types.ts` — **jamais** de type/enum épars dans le `.tsx`.

## Règles impératives

- **Arrow functions uniquement** — jamais de `function`.
- **Zéro style inline, zéro `.css`** — tout passe par des styled-components dans `UI.tsx`.
- **Types & enums (dont les `Props`) → `types.ts`**, pas inline dans le `.tsx`. Constantes → `constants.ts`, utilitaires → `helpers.ts`.
- Props transientes préfixées `$` : `<S.Button $active={active}>`.
- Réutiliser les composants form/ui existants avant d'en créer : `Field`, `NumberInput`, `ColorPicker`, `TagLine`, `TagLink`, `Tag`, `Button`.
- Accès store : `useShallow` obligatoire pour destructurer plusieurs valeurs (sinon boucle infinie). Ne pas importer le store dans un composant de preview (passer par props).
- Hint utilisateur contextuel → overlay canvas, pas dans le panneau d'outils.

## Gabarit `types.ts`

```ts
export type PanelProps = {
  label: string
}
```

## Gabarit `<Name>.tsx`

```tsx
import * as S from "./UI"
import type { PanelProps } from "./types"

export const Panel = ({ label }: PanelProps) => {
  return (
    <S.Root>
      <S.Title>{label}</S.Title>
    </S.Root>
  )
}
```

## Gabarit `UI.tsx`

```tsx
import styled from "styled-components"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
`

export const Title = styled.h3<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? "#fff" : "#888")};
`
```

## Gabarit `index.ts`

```ts
export { Panel as default } from "./Panel"
```

## Après scaffold

`yarn lint` puis brancher le composant là où il est consommé.

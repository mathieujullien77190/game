# Screens — structure obligatoire

Chaque screen suit exactement ce schéma :

```
Name/
  Name.tsx      → composant React, export nommé `export const Name`
  UI.tsx        → tous les styled-components, exportés nommés (import * as S)
  index.ts      → re-export(s) publics uniquement
  types.ts      → types et interfaces (Props, etc.)
  constants.ts  → constantes pures (pas de hooks, pas de JSX)
  helpers.ts    → fonctions pures sans contexte React (calculs, transformations)
```

**Convention de nommage** : pas de suffixe `Screen` — le dossier s'appelle `Accueil/`, le fichier `Accueil.tsx`, le composant `export const Accueil`.

## Règles

- `types.ts` : toujours présent dès qu'il y a un `type Props` ou tout autre type partagé
- `constants.ts` : créer si le composant déclare des constantes de module (`DIFF_COLOR`, `ICON_COLORS`, etc.)
- `helpers.ts` : créer si le composant déclare des fonctions pures appelables sans hooks
- `UI.tsx` : **zéro styled-component dans `Name.tsx`** — tout passe par `import * as S from "./UI"`
- `Name.tsx` n'importe que ses voisins directs (`./types`, `./UI`, `./constants`, `./helpers`) et les alias globaux (`engine/`, `store/`, `hooks/`, `components/`, `../../progressStore`, etc.)
- Extensions `.tsx` si le fichier contient du JSX, `.ts` sinon

## Exemple minimal

```ts
// types.ts
export type Props = { onBack: () => void }

// constants.ts
export const ACCENT_COLORS = { Tutoriel: "#2E9E6B", Avancé: "#3A6FD8", Expert: "#FF5630" }

// helpers.ts
import { MAP_LIST } from "../../maps"
export const isLocked = (idx: number, results: Record<string, { bestTime: number }>) =>
  idx > 0 && !results[MAP_LIST[idx - 1].id]

// UI.tsx
import styled from "styled-components"
export const Screen = styled.div`...`

// Name.tsx
import type { Props } from "./types"
import { ACCENT_COLORS } from "./constants"
import { isLocked } from "./helpers"
import * as S from "./UI"
export const Name = ({ onBack }: Props) => { ... }

// index.ts
export { Name } from "./Name"
```

# Conventions du store Zustand

## Structure

```
store/
  types.ts      → StoreState, StoreActions, Store, Set
  actions/      → factory functions par domaine
  actions.ts    → barrel : export * from "./actions/index"
  useStore.ts   → create<Store>((set) => ({ ...état initial, ...actions }))
  index.ts      → exports publics
```

## Règles

- Toujours `useShallow` pour destructurer plusieurs valeurs — sinon boucle infinie
- Actions : factory functions `(set: Set) => (...args) => set(state => ({...}))`
- Le type `Set` est défini dans `types.ts`
- Persistance via `useStore.subscribe` — pas de middleware
- Ne persister que les données métier, pas l'état UI transitoire
- Les entités sont sérialisées en données brutes et reconstruites au chargement
- Le JSON exposé dans l'UI ne contient pas les propriétés calculées

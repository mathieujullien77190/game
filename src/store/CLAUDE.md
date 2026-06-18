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
- Ne persister que les données métier, pas l'état UI transitoire (`hoveredXxxId`, `mode`, etc.)
- Les entités sont sérialisées en données brutes et reconstruites au chargement via `new EntityClass(...)`
- Le JSON exposé dans l'UI ne contient pas les propriétés calculées

## Pattern : ajouter une nouvelle entité

1. **`types.ts`** — ajouter `entities: Entity[]`, `nextEntityId: number`, `hoveredEntityId: string | null` dans `StoreState` ; actions dans `StoreActions` ; `EditorMode` += `"addEntity"`
2. **`actions/editor.ts`** — `addEntity`, `removeEntity`, `setEntityXxx`, `setHoveredEntityId`
3. **`useStore.ts`** — constante `LS_ENTITIES`, `loadEntities()`, initial state, wire actions, subscribe save
4. **`clearLines`** — reset aussi `entities: [], nextEntityId: 1`

## EditorMode

```typescript
"idle" | "addLine" | "addCurve" | "addStart" | "addArrival" | "addSwitch" | "addPainter"
```

Chaque mode est activé par le bouton dans l'onglet correspondant, désactivé par `setMode("idle")` après placement.

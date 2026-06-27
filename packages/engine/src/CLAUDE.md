# Conventions de l'engine

## Règles

- Tout en arrow functions — pas de `function` declarations
- JSX autorisé dans les classes `*Editor` et `*Preview` (méthode `render()`) — fichiers en `.tsx`
- Zéro React dans les classes de base (`Line`, `Token`, `Switch`, etc.)

## Pattern classes : Base → Editor / Preview

Chaque entité métier suit ce schéma à 3 niveaux :

```
Token          ← base : data pure (id, color, speed, type…), pas de render
  TokenPreview ← render JSX pour la simulation
  TokenEditor  ← render JSX pour l'éditeur (si besoin)

Line           ← base : data pure (start, end, points, computePoints)
  LinePreview  ← render JSX pour la simulation
  LineEditor   ← render JSX pour l'éditeur (dashed, endpoints, id)
```

**Règles du pattern :**
- La classe de base ne contient **jamais** de méthode `render`
- `*Preview` → render pour la simulation (couleurs réelles, rendu final)
- `*Editor` → render pour l'éditeur (dashed, handles, overlays)
- Les Managers instancient les classes `*Preview` / `*Editor`, jamais la base directement
- `PreviewManager` travaille exclusivement avec `*Preview`
- `EditorManager` travaille exclusivement avec `*Editor`

## Organisation

```
engine/
  Line/
    Line.ts          ← base
    LineEditor.tsx   ← extend Line, render() JSX editor
    LinePreview.tsx  ← extend Line, render() JSX preview
  Token/
    Token.ts         ← base
    TokenPreview.tsx ← extend Token, render() JSX preview
  Manager/
    Manager.ts       ← base générique
    EditorManager.ts ← orchestre *Editor
    PreviewManager.ts← orchestre *Preview
  Link/
  utils.ts           ← rng
  types.ts
  constants.ts
```

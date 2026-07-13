---
name: check-engine-purity
description: Vérifie que packages/engine reste pur — zéro React, zéro DOM (portable RN/WebView) et aucune méthode draw dans les classes de base du pattern Base→Editor/Preview. Déclencheurs — "engine pur", "portabilité engine", après avoir ajouté du code dans packages/engine, avant un commit touchant l'engine.
---

# check-engine-purity

`packages/engine/` doit rester **portable** (il tourne en WebView mobile ET en web éditeur). Trois règles du CLAUDE.md à ne jamais casser :

1. **Zéro React** — pas d'import `react` / `react-dom`.
2. **Zéro DOM** — pas de `document` / `window` / `localStorage` / `navigator` (l'engine cible l'interface `Renderer`, `tsconfig` force `lib: ["ES2023"]` sans DOM). Les effets plein écran DOM vivent dans `canvas-render`, pas dans l'engine.
3. **Pas de `draw` en classe de base** — le pattern `Foo` / `FooEditor` / `FooPreview` interdit toute méthode `draw` sur la base `Foo`.

## Lancer

```bash
node .claude/skills/check-engine-purity/check-engine-purity.mjs
```

Exit `0` = pur, `1` = violation(s) listées avec `fichier:ligne`, `2` = erreur.

## Notes

- La détection DOM est une **heuristique** ligne à ligne (ignore les commentaires) : vérifier un éventuel faux positif dans une string.
- Si un besoin DOM légitime apparaît (effet plein écran…), il va dans `packages/canvas-render`, pas dans l'engine.

---
name: check-aliases
description: Vérifie que les alias d'import sont synchronisés entre tsconfig.base.json (typecheck) et les resolve.alias des vite.config.ts (edition + app/webview). Déclencheurs — "alias désynchro", "check alias", "import qui casse au runtime mais passe le typecheck", après avoir ajouté/renommé un package ou un alias.
---

# check-aliases

Les alias sont déclarés **en double** dans ce monorepo et doivent rester synchro (cf. CLAUDE.md § Imports) :

- `tsconfig.base.json` → `compilerOptions.paths` (utilisé par le typecheck)
- `packages/edition/vite.config.ts` → `resolve.alias` (bundling éditeur web)
- `packages/app/webview/vite.config.ts` → `resolve.alias` (bundling webview mobile — sous-ensemble : engine + canvas-render)

Un alias présent d'un côté seulement passe le typecheck puis **casse au runtime** (ou l'inverse). Bug invisible.

## Lancer

```bash
node .claude/skills/check-aliases/check-aliases.mjs
```

Exit `0` = synchro, `1` = divergence (détaillée), `2` = erreur de lecture.

## Quand l'utiliser

- Après avoir ajouté/renommé un package ou un alias (`store/`, `hooks/`, `@tic-tac-tic/*`…)
- Avant un commit qui touche `tsconfig.base.json` ou un `vite.config.ts`
- Dans le cadre du `/checkup`

## En cas d'échec

Ouvrir le fichier signalé et ajouter/retirer l'entrée manquante. Rappel de la correspondance des formes :
`@tic-tac-tic/engine/*` (tsconfig) ↔ `{ find: /^@tic-tac-tic\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") }` (vite).

---
name: checkup
description: Lance TOUTES les vérifications du projet Tic-Tac-Tic en une commande — alias synchro, pureté de l'engine, validité de map.json — et affiche un récap. Déclencheurs — "checkup", "vérifie tout", "santé du projet", "avant commit", "tout est ok ?", "full check".
---

# checkup

Commande de contrôle santé du monorepo Tic-Tac-Tic. Regroupe les trois vérifications :

1. **check-aliases** — alias synchro entre `tsconfig.base.json` et les `vite.config.ts`
2. **check-engine-purity** — engine sans React/DOM, pas de `draw` en classe de base
3. **validate-map** — cohérence de `packages/maps/map.json`

## Lancer

```bash
node .claude/skills/checkup/checkup.mjs
```

Le script exécute les trois, imprime chaque rapport puis un récap. **Exit code = nombre de vérifications en échec** (0 = tout vert).

## Compléments recommandés

Le checkup couvre les invariants spécifiques au projet, pas le style ni les types. Après un `checkup` vert, pour un contrôle complet avant commit :

```bash
yarn lint
```

## Quand l'utiliser

- Avant chaque commit un peu large
- Après avoir touché l'engine, les alias, ou une map
- Quand un import casse au runtime alors que le typecheck passe (souvent → `check-aliases`)

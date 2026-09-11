# @tic-tac-tic/app — jeu Tic-Tac-Tic en React Native (Skia)

Rend **exactement** la preview web, via `SkiaRenderer` (@tic-tac-tic/skia-render) qui implémente
l'interface `Renderer` de l'engine. Sim + draw = 100% réutilisés depuis `@tic-tac-tic/engine`.

## Ce qui n'a PAS pu être vérifié ici

Pas d'émulateur/device dans l'environnement de dev. Les fichiers + config sont scaffoldés
mais **le run et le typecheck de ce package se font sur ta machine**. La partie vérifiée :
`@tic-tac-tic/skia-render` typecheck contre les vrais types `@shopify/react-native-skia` (OK).

## Setup (sur ta machine)

react-native-skia est **natif** → pas Expo Go, il faut un **dev build**.

```bash
# depuis la racine du monorepo
yarn install                      # installe expo + react-native + skia (lourd)
cd packages/app
npx expo install --fix            # aligne les versions expo/react/react-native
npx expo prebuild                 # génère android/ (+ ios/ sur macOS)
npx expo run:android              # build + lance sur émulateur/device
# ou run:ios sur macOS
```

## Points à surveiller au premier run

- **Versions** : `package.json` fixe expo ~53 / rn 0.79 / react 19.2.6 en best-guess.
  `expo install --fix` fait autorité.
- **Metro monorepo** : `metro.config.js` active `unstable_enablePackageExports` pour résoudre
  les subpaths `@tic-tac-tic/*` (source TS). Si un `@tic-tac-tic/...` ne résout pas, vérifier ce flag.
- **map.json** : importé statique depuis `@tic-tac-tic/maps`. Le seed est vide → écran blanc tant
  qu'aucune map n'est dessinée dans l'éditeur (`yarn edition`) et sauvée.
- **Scaling** : `App.tsx` scale le SkCanvas pour tenir CANVAS_W×CANVAS_H dans la vue.
- **Effets plein écran** (inverter/grayscale/dark) : web-only pour l'instant, non rendus ici.

## Comment ça marche

`App.tsx` : `buildPreviewManager(map)` → boucle `requestAnimationFrame` → `tickSim(t)` +
`createPicture(cv => pm.drawAllPreview(new SkiaRenderer(cv, W, H)))` → `<Picture>`.

# Manager — architecture

## Les deux managers

- `Manager<T>` (base) : stocke `data.lines` + `addLine`. Jamais instancié directement.
- `EditorManager extends Manager<LineEditor>` : travaille avec les `*Editor`, gère l'édition (ajout de lignes, génération automatique des links).
- `PreviewManager extends Manager<LinePreview>` : travaille avec les `*Preview`, gère la simulation + le rendu.

## PreviewManager — cycle de vie

```
initSimulation(tokens, links, starts, switches, …)
  → construit les *Preview depuis les data brutes (base classes)
  → peuple les index de lookup (linkByEndpointKey, inverterLinkMap, …)
  → instancie les tokens avec leur startAt calculé

tickSim(timestamp)              ← appelé à chaque frame (rAF)
  → avance les tokens (token.advance)
  → à chaque fin de ligne : token.transition(…, this.data)
      → transition lit linkMap, inverterLinkMap, transformerByLinkId
      → retourne { isInverted, isGrayscale, isDark } mis à jour
  → gère les explosions, la vitesse, les cops

drawAllPreview(ctx)             ← appelé après tickSim
  → séquence de méthodes nommées, une par responsabilité (voir ci-dessous)
```

## drawAllPreview — ordre des passes

| Méthode | Rôle |
|---|---|
| `clearBackground` | reset canvas + fond blanc |
| `drawLinesBefore` | fond des rails |
| `drawSwitchesBefore` | prepareFrame + arc avant |
| `drawSwitchLinks` | liaisons pointillées entre switches |
| `drawScreenGateMarkers` | points entry/exit dans l'écran cible |
| `drawTransformers` | nœuds transformer |
| `drawArrival` | nœud d'arrivée |
| `drawStartNode` | nœud de départ + token en attente |
| `drawLinesAfter` | indicateurs de vitesse sur les rails |
| `drawSwitchesAfter` | dot actif du switch |
| `drawTokens` | tokens (normal + explosion) |
| `drawStartAfter` | anneau de compte à rebours |
| `drawScreenGates` | portails (miniature écran cible) |
| `drawInverters` | nœuds inverter (sync `active` → dot vert/rouge) |
| `drawMiniMap` | HUD minimap (écran précédent) |
| `drawHudStats` | FPS + compteur tokens |

## Index de lookup dans `data`

- `linkByEndpointKey["lineId::endpoint"]` → id du link (tous liens, activés ou non)
- `linkMap["lineId::endpoint"]` → `LinkEndpoint` destination (liens activés seulement)
- `transformerByLinkId[linkId]` → id du transformer
- `inverterLinkMap.get(linkId)` → `"invert" | "grayscale" | "dark"`
- `screenGateByLinkId[linkId]` → `ScreenGatePreview`
- `screenGateByExitKey["lineId::endpoint"]` → `ScreenGatePreview`

## Règles

- Chaque entité gère son propre dessin (`draw`, `drawBefore`, `drawAfter`, `drawEntry`, `drawExit`, `drawMini`…). Le manager résout les positions (point sur la ligne) et délègue.
- Les effets plein écran (`isInverted`, `isGrayscale`, `isDark`) sont lus par `applyScreenEffects()` côté `canvas-render` — l'engine n'expose que l'état.
- `previewScreenId` + `previewScreenHistory` gèrent la navigation entre écrans imbriqués.

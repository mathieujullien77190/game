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
| `drawLinesBefore` | fond des rails (opacité par `lineFadeOpacity`, voir ci-dessous) |
| `drawSwitchesBefore` | prepareFrame + arc avant |
| `drawSwitchLinks` | liaisons pointillées entre switches |
| `drawScreenGateMarkers` | points entry/exit dans l'écran cible |
| `drawTransformers` | nœuds transformer |
| `drawArrival` | nœud d'arrivée |
| `drawStartNode` | nœud de départ + token en attente |
| `drawLinesAfter` | indicateurs de vitesse sur les rails (même opacité que `drawLinesBefore`) |
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

## Profiling (`Profiler`)

`initSimulation` appelle `Profiler.reset()` en tout premier (vide l'historique à chaque (re)lancement de preview, y compris via le bouton Restart). `tickSim` et chacune des méthodes de `drawAllPreview` listées ci-dessus sont encadrées d'un `Profiler.start(label)`/`Profiler.end(label)` (label = nom de la méthode). Voir `../CLAUDE.md` pour le fonctionnement du `Profiler` (coût nul quand désactivé).

## Ordre de dessin des lignes (`visibleLines`)

`drawAllPreview` calcule `visibleLines` une fois par frame (`Object.values(this.data.lines)` filtré sur l'écran courant), réutilisé tel quel par `drawLinesBefore` et `drawLinesAfter`. Il est **trié** (tri stable) pour que les lignes sans `color` (grises) soient dessinées en dernier, donc par-dessus les lignes colorées aux intersections — indépendant de l'ordre du tableau `lines` dans `map.json`.

## `lineFadeOpacity(lineId)` — ligne accrochée à un Start `fadeLineAfter`

`drawLinesBefore`/`drawLinesAfter` enveloppent chaque `line.drawBefore`/`drawAfter` d'un `ctx.save()` / `ctx.globalAlpha = this.lineFadeOpacity(line.id)` / `ctx.restore()`. `lineFadeOpacity` cherche, parmi `this.data.starts`, celui dont `fadeLineAfter > 0` et `lineId` correspond, et retourne son `lineOpacity` (sinon `1`, pleinement visible) — voir `Start/CLAUDE.md`. Le minuteur ne démarre pas à `elapsedSeconds = 0` mais au départ du **dernier** token du start (`start.queueEmptyAt`, posé par `tickSim` dès que sa file de spawn est vide) ; `tickSim` fait glisser `start.lineOpacity` vers `0`/`1` (`approach`, `2/s`) selon que `elapsedSeconds` a dépassé `queueEmptyAt + fadeLineAfter`, avant `drawAllPreview` — la valeur lue ici est donc toujours celle de la frame courante.

## Règles

- Chaque entité gère son propre dessin (`draw`, `drawBefore`, `drawAfter`, `drawEntry`, `drawExit`, `drawMini`…). Le manager résout les positions (point sur la ligne) et délègue.
- Les effets plein écran (`isInverted`, `isGrayscale`, `isDark`) sont lus par `applyScreenEffects()` côté `canvas-render` — l'engine n'expose que l'état.
- `previewScreenId` + `previewScreenHistory` gèrent la navigation entre écrans imbriqués.

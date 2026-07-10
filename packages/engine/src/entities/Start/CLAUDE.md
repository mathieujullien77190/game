# Start/ — point de spawn des tokens

## Structure

- `Start.ts` — base : `id` (`createIdCounter("start")`), `lineId`, `endpoint`, `delay` (intervalle entre deux spawns), `firstDelay` (délai avant le premier, défaut 2s), `screenId`, `tokens: TokenConfig[]` (config plate `{id, color, type, speed, angled?}`, pas des instances `Token`). `angled` = orientation de spawn d'un token `square` (0° ou 45°, même convention que `Arrival.Demand.angled`) ; `PreviewManager.initSimulation` l'applique en posant `rotationOffset`/`targetRotationOffset` à `π/4` directement (pas d'anim d'entrée).
- `StartEditor.ts` — exporte `drawStartShape(ctx, pt)` (disque noir r14 + triangle blanc "play"), réutilisée par `EditorManager` pour le ghost-preview.
- `StartPreview.ts` — `prepareFrame(pt, remaining, tokenColor?, refDelay?)` appelé chaque frame par `PreviewManager.drawStartNode` avant le dessin (pas de constructeur étendu, l'état transitoire passe par cette méthode comme pour `Switch.prepareFrame`).

## Fonctionnement

- **Un seul start actif** : bien que `starts` soit une `Record`, seul `Object.values(starts)[0]` est utilisé pour la simulation (convention du projet — voir `Manager/CLAUDE.md`).
- Tous les tokens d'un start spawnent avec `startAt = firstDelay + i * delay` (le premier utilise `firstDelay`, pas `delay`) — calculé une fois dans `PreviewManager.initSimulation`, pas recalculé dynamiquement.
- `animCountdownArc` : anneau coloré qui se remplit de `0` à `2π` au fur et à mesure que `remaining` (temps avant le prochain spawn, passé par `prepareFrame`) diminue ; `tokenColor` = couleur du prochain token en attente.
- `opacity` : fade (piloté par `PreviewManager.tickSim`, vitesse `2/s`) vers `0` dès qu'**aucun token de ce start n'est encore en attente de spawn** (`elapsedSeconds < token.startAt` pour aucun), vers `1` sinon. Ne dépend donc pas de la fin du trajet des tokens déjà lancés, seulement de l'épuisement de la file de spawn. `drawAfter` s'arrête net si `opacity <= 0`.
- Timing : `drawBefore` vide, tout dans `drawAfter` — le token en attente lui-même est dessiné séparément par `PreviewManager.drawStartNode` (appel direct à `token.drawBefore`, plus tôt dans la séquence, avant `drawTokens`) ; l'anneau du start passe donc visuellement **par-dessus** ce token (même trick que pour `Arrival`, voir `entities/CLAUDE.md`).

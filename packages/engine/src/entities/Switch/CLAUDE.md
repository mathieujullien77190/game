# Switch/ — nœud de branchement

## Structure (4 fichiers, pas 3)

- `Switch.ts` — base : `id` (`createIdCounter("switch")`), `linkIds` (tous les links convergeant sur ce nœud), `activeLinkId`, `screenId`, `color`.
- `switchUtils.ts` — deux helpers géométriques partagés :
  - `getSwitchEnterPoint(linkIds, links)` : trouve l'endpoint physique commun à **tous** les `linkIds` du switch (intersection successive des paires d'endpoints) — c'est le point d'entrée du switch.
  - `curveIntersectAngle(pts, endpointSide, cx, cy, r)` : parcourt les `points[]` d'une ligne depuis son endpoint jusqu'à franchir le rayon `r` autour de `(cx, cy)`, retourne l'angle réel à ce croisement. Nécessaire pour aligner les flèches sur la tangente réelle d'une ligne courbe/sine/spiral plutôt que sur l'angle brut de l'endpoint.
- `SwitchEditor.ts` — exporte `drawSwitchShape(ctx, pt)` (disque violet `#7c3aed` r18), réutilisée par `EditorManager` pour le ghost-preview.
- `SwitchPreview.ts` — logique de routage + animation des flèches.

## Fonctionnement

- `cycle()` : appelé au clic joueur, fait tourner `activeIndex` parmi `linkIds`, déclenche `pulseTimer` (anneau de feedback bref).
- `displayAngle`/`targetAngle` + `animateAngle()` : la flèche active tourne progressivement vers la nouvelle direction (vitesse 8, plus court chemin angulaire avec wrap-around) plutôt que de sauter instantanément.
- `prepareFrame(lines, links, linkMap)` (appelé par `PreviewManager.drawSwitchesBefore`) recalcule chaque frame `_enterAngle` (direction entrante) et `_allDestAngles` (toutes les directions de sortie possibles), via `curveIntersectAngle`.
- `applyToLinkMap(links, linkMap)` : **c'est ici que vit le routage réel** — écrit la destination active dans `linkMap` (utilisé ensuite par `TokenPreview.transition()`). Tout le reste de la classe n'est que feedback visuel.
- `tick(deltaSeconds)` : avance `pulseTimer`/`displayAngle`, appelé pour **tous** les switches à chaque frame par `PreviewManager.tickSim`, indépendamment de l'écran affiché (seul le dessin est filtré par écran).
- `hitTest(x, y)` : détection de clic (distance au centre ≤ `SWITCH_R`), utilisée pour déclencher `cycle()` depuis l'UI.

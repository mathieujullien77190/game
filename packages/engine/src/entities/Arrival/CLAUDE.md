# Arrival/ — point d'arrivée

## Structure (4 fichiers, pas 3)

- `Arrival.ts` — base : `id`, `lineId`, `endpoint`, `demands: Demand[]`, `screenId`, `queueSide`. Deux compteurs d'ID distincts via `createIdCounter` : `arrival` (id de l'entité) et `demand` (id de chaque `Demand`, créée par `makeDemand()`). `queueSide: "top" | "bottom" | "left" | "right" | "hidden"` contrôle où s'affiche la file des prochaines demandes en preview.
- `demandShape.ts` — helper partagé `traceDemandShape(ctx, x, y, type, angled, lineAngle=0, r=8)` : construit le path (cercle, carré arrondi, ou triangle via `traceTriangle`) orienté sur `lineAngle`, +45° si `angled` pour un carré ou +60° pour un triangle (voir `Token/CLAUDE.md` pour la logique de période par forme), sans fill/stroke. `lineAngle` = angle de la ligne au point d'arrivée (cohérent avec la rotation réelle du token, cf. `Token/CLAUDE.md`), pas l'angle écran. Éditeur et Preview l'utilisent puis appliquent leur propre style (l'éditeur ajoute un contour noir, le preview non).
- `ArrivalEditor.ts` — dessine un disque noir (r14) + soit un carré blanc (aucune demand), soit le premier `Demand` par-dessus. Exporte aussi `drawArrivalEmptyShape(ctx, pt)` (disque + carré blanc), réutilisé tel quel par `EditorManager` pour le ghost-preview au moment de placer une arrivée.
- `ArrivalPreview.ts` — toute la logique visuelle de simulation.

## Fonctionnement (ArrivalPreview)

- `currentDemandIndex` = index de la prochaine `Demand` à satisfaire. N'avance que sur un match confirmé (voir plus bas).
- `arcFill` / `arcTarget` : anneau de progression segmenté en `demands.length` parts égales (`animArcSegments`). `arcTarget` est incrémenté par `TokenPreview.transition()` à chaque arrivée correcte ; `arcFill` le rattrape en douceur dans `PreviewManager.tickSim` (`+ deltaSeconds * 3`).
- `flashColor` / `flashProgress` : anneau de flash, vert (`#2E9E6B`) sur match, rouge (`#e53935`) sur mismatch — posé par `TokenPreview.transition()`, pas par cette classe.
- `animNextDemands` : file des prochaines demandes (`demands.slice(currentDemandIndex+1, +1+3)`), positionnée selon le vecteur de `queueSide` (`QUEUE_VECTORS`), alpha dégressif par position. Ne dessine rien si `queueSide === "hidden"`.
- `opacity` : fade géré par `PreviewManager.tickSim`, cible `0` quand `currentDemandIndex >= demands.length` (toutes les demandes satisfaites), sinon `1`. Multiplié dans chaque `globalAlpha` de la classe (pas un simple wrapper global, car `animFlashRing`/`animDemandFade`/`animNextDemands` fixent déjà leur propre alpha).
- **Timing inversé** : `drawBefore` ne fait que stocker `_pt` (vide côté dessin) ; tout le rendu (anneau, arc, flash, file, demande courante) est dans `drawAfter`, appelée après `drawTokens` par `PreviewManager.drawArrivalAfter` — l'anneau passe donc visuellement par-dessus le token qui arrive (même trick que `Start`).
- `correctCount` est déclaré mais n'est lu/écrit nulle part ailleurs dans le code — champ mort actuellement.

## Matching couleur/forme/orientation

La vérification (couleur ET type ET, pour les formes à symétrie rotationnelle, orientation) ne vit **pas** dans cette classe mais dans `TokenPreview.transition()` (voir `Token/CLAUDE.md`). L'orientation attendue (`Demand.angled`) est comparée à l'orientation réelle du token, dérivée de `targetRotationOffset % period` où `period` dépend de la forme (carré : π/2, triangle : 2π/3 ; round/cop n'ont pas de `period` donc pas de vérification d'orientation). En cas de mismatch : flash rouge, mais `arcTarget`/`currentDemandIndex` ne bougent pas — la demande reste ouverte pour le prochain token.

## Plusieurs arrivées

Contrairement à `Start` (un seul actif par convention), **toutes** les arrivées sont actives simultanément — chacune a sa propre file de `demands` et progresse indépendamment. `PreviewManager.data.arrivals: ArrivalPreview[]` + `data.arrivalByKey: Record<"lineId::endpoint", ArrivalPreview>` (peuplé dans `initSimulation`, une entrée par arrivée). `TokenPreview.transition()` résout l'arrivée via `ctx.arrivalByKey[\`${lineId}::${arrivedAt}\`]` — un token n'affecte que l'arrivée sur le lien où il termine sa course. `EditorManager.drawAll` prend `arrivals: ArrivalEditor[]` (au lieu d'un `ArrivalEditor | null`), même pattern que `starts`. `map.json` sérialise `arrivals: [...]` (tableau) ; l'ancien champ singulier `arrival` est encore lu par `deserializeMap` pour compat ascendante (migré en tableau à un seul élément si `arrivals` est absent).

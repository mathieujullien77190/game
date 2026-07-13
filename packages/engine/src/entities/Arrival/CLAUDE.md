# Arrival/ — point d'arrivée

Anneau qui réclame une suite de `demands` (couleur + forme + orientation). Toutes les arrivées sont actives en même temps, chacune avec sa propre file. Le matching réel vit dans `TokenPreview.transition()`, pas ici.

## Structure (4 fichiers)
- `Arrival.ts` — base : `lineId`, `endpoint`, `demands: Demand[]`, `queueSide`, `screenId`. Deux compteurs d'ID (`arrival`, `demand`).
- `demandShape.ts` — helper partagé `traceDemandShape(...)` : trace la forme d'une demande (cercle/carré/triangle), orientée sur l'angle de la ligne. Utilisé par l'éditeur et la preview.
- `ArrivalEditor.ts` — disque noir + première demande ; exporte `drawArrivalEmptyShape` (ghost-preview).
- `ArrivalPreview.ts` — rendu simulation : anneau de progression segmenté, flash vert/rouge, file des prochaines demandes.

# Token/ — balle colorée

Le moteur de simulation d'un token (avancement, routage, rendu). Pas de `TokenEditor` : un token n'existe que comme `TokenConfig` dans le `tokens[]` d'un Start.

## Structure (2 fichiers)
- `Token.ts` — base : `color`, `type: "round" | "square" | "cop" | "triangle"`, `speed`. Exporte `ANGLED_LABEL`.
- `TokenPreview.ts` — `advance()` (avance le long de `points[]`) + `transition()` + rendu.

## Note
`transition(arrivedAt, excess, ctx)` est **la machine à états centrale** de la simulation : elle gère, dans l'ordre, retour de portail → arrivée (matching couleur/forme/orientation) → transformer rotate → inverter → screenGate → transformer color/shape/fade → suivi de link → cloner. Les `*Preview` des nœuds ne font que du rendu.

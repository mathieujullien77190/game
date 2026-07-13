# Line/ — segment de rail

Rail sur lequel avancent les tokens. `points[]` (chacun avec son `angle` tangent) est précalculé par `computePoints()`, un algo par type : `straight`, `curve`/`elbow` (bézier reparamétré par longueur d'arc), `sine`, `spiral`.

## Structure
- `Line.ts` — base : `start`/`end`/`cp1`/`cp2`, `type`, `points[]`, + params par type (`boost`, `tunnel`, `showSpeed`, `limitation`, `frequency`/`amplitude`, `turns`, `flip`). ID à part : `generateLineId()` (lineA…lineZ puis line1, line2…), pas `createIdCounter`.
- `LineEditor.ts` — trait pointillé, poignées de contrôle (curve/elbow), points départ/arrivée, label d'id.
- `LinePreview.ts` — rail statique + glow animé (fenêtre jaune qui défile selon `boost`) + badges vitesse/limitation.

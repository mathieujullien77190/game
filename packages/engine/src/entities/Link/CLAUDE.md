# Link/ — connexion entre deux endpoints de lignes

Un seul fichier, pas de représentation visuelle propre. Auto-généré par `EditorManager.addLine` quand deux endpoints coïncident (`pointsEqual`) sur le même écran.

## Structure
- `Link.ts` — `LinkEndpoint = { lineId, endpoint }`, `Link { id, line1, line2, activated }`.

⚠️ `id = ${line1.lineId}::${line1.endpoint}-${line2.lineId}::${line2.endpoint}` — **l'ordre compte** (`line1` = ligne déjà présente, `line2` = celle ajoutée). Cet id sert de clé pour rattacher Transformer/Inverter/Switch/ScreenGate → l'ordre des lignes dans le JSON fixe le nommage. `activated = false` : le link reste dans `linkByEndpointKey` mais pas dans `linkMap` (token bloqué).

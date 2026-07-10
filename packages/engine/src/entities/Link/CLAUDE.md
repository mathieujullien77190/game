# Link/ — connexion entre deux endpoints de lignes

## Structure

Seul fichier : `Link.ts`. Pas de `LinkEditor`/`LinkPreview` — un link n'a pas de représentation visuelle propre (pas de forme à sa position), il est dessiné en pointillé entre switches directement par `PreviewManager.drawSwitchLinks`, ou simplement traversé silencieusement par les tokens.

- `LinkEndpoint = { lineId, endpoint }` (`endpoint: "start" | "end"`).
- `Link { id, line1, line2, activated }`.
- `id` = `` `${line1.lineId}::${line1.endpoint}-${line2.lineId}::${line2.endpoint}` `` — **l'ordre compte** : `line1` est toujours la ligne déjà présente dans la map, `line2` celle qu'on vient d'ajouter (voir `EditorManager.addLine`). C'est cet id qui sert de clé pour rattacher un `Transformer`, `Inverter`, `Switch` ou `ScreenGate` à ce link — donc l'ordre d'ajout des lignes dans le JSON fixe définitivement le nommage.

## Fonctionnement

- **Auto-généré uniquement** — jamais créé à la main ailleurs que dans `EditorManager.addLine` (et `refreshLinksForEndpoint` quand une ligne est déplacée), quand deux endpoints coïncident (`pointsEqual`) sur le même `screenId`.
- `activated`: si `false`, `PreviewManager.initSimulation` ne peuple pas `linkMap` pour ce link (mais le laisse quand même dans `linkByEndpointKey`) — un token qui atteint cet endpoint s'arrête (`direction = 0`), il n'y a pas de ligne suivante. Togglable depuis `LineTab` (édition) pour désactiver une connexion sans supprimer les lignes.
- `linkByEndpointKey` (toujours peuplé) vs `linkMap` (seulement les links activés) : voir `Manager/CLAUDE.md` pour le détail des deux index.

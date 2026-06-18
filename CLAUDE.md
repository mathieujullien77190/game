# Projet : Level Editor — jeu de routage de balles

Éditeur visuel canvas + mode preview. L'utilisateur dessine des lignes, place des entités (starts, arrivals, switches, painters), configure les links, puis lance une simulation de balles colorées.

## Stack

Vite + React + TypeScript + Zustand + styled-components. Canvas 2D pur, pas de lib de rendu.

## Imports

- Alias obligatoires sauf `./` dans le même dossier
- Alias configurés : `engine/`, `store/`, `hooks/`, `components/`
- Exemple : `import { EditorManager } from "engine/Manager"` (pas de chemin relatif)

## Organisation

```
src/
  engine/       → logique pure, canvas, classes métier (zéro React)
  store/        → Zustand, state global, persistence localStorage
  hooks/        → useCanvasDraw, useCanvasDrawPreview
  components/   → React UI, LevelEditor, ToolsPanel, tabs/
```

## Entités du niveau

Chaque entité suit le pattern `Base → Preview → Editor` (voir engine/CLAUDE.md).

| Entité   | Champ clé         | Rôle                                          |
|----------|-------------------|-----------------------------------------------|
| Line     | start, end, control | segment/courbe navigable par les balles      |
| Link     | line1, line2, active | connexion entre 2 anchors de lignes         |
| Start    | position: LineRef | point de départ des balles avec délai        |
| Arrival  | position: LineRef | destination cible                            |
| Switch   | input: LineRef    | aiguillage manuel — cycle les links actifs   |
| Painter  | input, color      | repeint une balle et la stoppe 500ms         |
| Ball     | color, speed      | balle lancée par chaque Start                |

## Anchor key format

`"lineId::anchor"` (ex: `"line1::end"`) — clé utilisée dans tous les Record de routing, arrivalPaths, painterMap.

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


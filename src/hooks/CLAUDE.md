# Conventions des hooks

- Dans `src/hooks/`, préfixés `use`, un fichier par hook, export nommé
- Tout en arrow functions
- `useState` pour ce qui doit déclencher un re-render, `useRef` pour l'état muté sans re-render

## useCanvasDraw

Dessine le canvas éditeur. Reçoit `EditorManager` + tous les `hoveredXxxId` comme params.  
Appelle `manager.drawAll(ctx, hoveredLineId, hoveredStartId, hoveredArrivalId, hoveredLinkId, hoveredSwitchId, hoveredPainterId)`.  
Ajouter un param pour chaque nouvelle entité hoverable.

## useCanvasDrawPreview

Dessine le canvas preview via RAF loop. Reçoit `PreviewManager | null`.  
Appelle `manager.tickSim()` puis `manager.drawAllPreview(ctx)` à chaque frame.  
Guard `if (!isPreview || !manager)` — ne démarre pas si null.

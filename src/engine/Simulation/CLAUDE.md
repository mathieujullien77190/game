# Simulation

## SimulationState

```typescript
{
  elapsed: number        // ms depuis initSim
  active: BallInstance[] // balles en mouvement
  pending: PendingLaunch[] // balles en attente de lancement
  done: string[]         // instanceIds des balles perdues
  arrived: ArrivedBall[] // balles arrivées à destination
  held: HeldBall[]       // balles immobilisées par un Painter
}
```

## tick()

```typescript
tick(state, lines, activePaths, arrivalPaths, painterMap) → SimulationState
```

- `painterMap: Record<anchorKey, color>` — fourni par `PreviewManager.painterMap` (issu de `routing.painterMap`)
- `allPaths` **supprimé** de la signature (était pour autoSwitchKeys, feature retirée)
- Avance chaque balle de `ball.speed * (BASE_PX_PER_SEC / FPS)` pixels

## Painter hold

Quand une balle atteint un anchor présent dans `painterMap` :
1. `handleTransition` retourne `{ _held: true, ball: {...ball, color: newColor}, anchor }`
2. `tick` ajoute à `held` avec `releaseAt = elapsed + PAINTER_HOLD_MS` (500ms)
3. Au tick suivant où `releaseAt <= elapsed` : la balle transite vers le prochain path et reprend

## BallInstance position

```typescript
{ lineId, ptIdx, segOffset, direction: 1|-1 }
```
- `direction=1` → avance vers `end` (index croissant)
- `direction=-1` → avance vers `start` (index décroissant)
- Position réelle interpolée depuis `line.points[ptIdx]` + `segOffset` px le long du segment

## initSimulation

Lance toutes les balles × tous les starts. `launchAt = start.delay * (ballIndex + 1)`.

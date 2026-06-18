# Manager

Deux managers distincts selon le mode actif dans LevelEditor.

## EditorManager vs PreviewManager

| | EditorManager | PreviewManager |
|---|---|---|
| Lignes | `LineEditor` | `LinePreview` |
| Switches | `SwitchEditor` | `SwitchPreview` (reconstruit depuis routing) |
| Painters | `PainterEditor` | `PainterPreview` |
| Méthode draw | `drawAll(ctx, ...hoveredIds)` | `drawAllPreview(ctx)` |
| Simulation | non | `initSim/tickSim/resetSim` |

**`EditorManager`** — instancié via `useMemo` à chaque changement de `levelJSON`.  
**`PreviewManager`** — instancié dans `useEffect` au toggle preview, stocké en `useState` (pas useRef — doit déclencher re-render).

## routing.ts

Source de vérité pour le routage. Fonctions exportées :

- **`buildRouting(json)`** → construit `RoutingTables` depuis le JSON du niveau
- **`cycleSwitch(switchId, switches, activePaths, allPaths, switchAnims, lines)`** → mute activePaths + switchAnims, partagé par les deux managers

### RoutingTables

```typescript
{
  links: Record<string, Link>
  activePaths: Record<string, AnchorTarget>   // anchorKey → destination active
  allPaths: Record<string, AnchorTarget[]>    // anchorKey → toutes les destinations possibles
  arrivalPaths: Record<string, string>        // anchorKey → arrivalId
  initialSwitchIndices: Record<string, number> // snapshot pour resetSim
  switches: Record<string, SwitchEditor>
  painters: Record<string, PainterEditor>
  painterMap: Record<string, string>          // anchorKey → couleur cible
}
```

## LevelJSON

Contrat entre le store et les managers. Construit dans `LevelEditor.tsx` via `useMemo`.

```typescript
{ lines, links, starts, arrivals, switches, painters, balls }
```

Switches et painters utilisent `input: LineRef` (pas `position` + `enter` — fusionnés).

## PreviewManager : reconstruction des switches

`buildRouting` retourne des `SwitchEditor`. PreviewManager les **re-construit** en `SwitchPreview` :
```typescript
this.switches[id] = new SwitchPreview(id, sw.input, sw.activeIndex);
```
→ La console affiche bien `SwitchPreview`, pas `SwitchEditor`.

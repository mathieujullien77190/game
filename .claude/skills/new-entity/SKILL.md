---
name: new-entity
description: Scaffold une nouvelle entité de l'engine selon le pattern à 3 niveaux Base → Editor → Preview, et la branche dans EditorManager + PreviewManager. Déclencheurs — "nouvelle entité engine", "ajouter un transformer/switch/gate/…", "créer une entité", "scaffold entity".
---

# new-entity

Crée une entité de l'engine en respectant **exactement** le pattern du CLAUDE.md. Demander à l'utilisateur le **nom** (PascalCase, ex. `Magnet`) et sur quoi elle se pose (un `linkId` comme transformer/inverter, ou un `lineId`+`endpoint` comme arrival, ou un nœud comme switch).

## Structure à créer

```
packages/engine/src/entities/<Name>/
  <Name>.ts          ← base : data pure, constructeur, compteur d'ID. JAMAIS de méthode draw.
  <Name>Editor.ts    ← extends <Name>, méthode draw = (ctx: Renderer, pt: Point) => {…} (dashed/handles éditeur)
  <Name>Preview.ts   ← extends <Name>, drawBefore/drawAfter de simulation (voir gabarit)
  CLAUDE.md          ← courte note sur la mécanique de l'entité (présent dans toutes les entités)
```

- Les **type unions propres à l'entité** (ex. `TransformerType`) se déclarent et s'exportent dans le fichier de **base** `<Name>.ts` (pas de fichier `types.ts` par entité). Les types partagés vivent dans `engine/src/types.ts`.
- Les **constantes** (durées, rayons spécifiques…) vont dans `engine/src/constants.ts` (top-level), pas par entité ; les valeurs de thème (couleurs, `RADII`, `STROKE_WIDTHS`) dans `theme.ts`.
- Imports **cross-entity** : chemins relatifs `../OtherEntity/`.

## Règles impératives (sinon check-engine-purity casse)

- La base `<Name>.ts` : **zéro `draw`**, zéro React, zéro DOM. Import `Renderer` seulement dans les `*Editor`/`*Preview`.
- Le draw cible l'interface `Renderer` (`engine/src/render/Renderer.ts`), pas `CanvasRenderingContext2D`.
- Id : `const <name>Ids = createIdCounter("<prefix>")` + `export const sync<Name>Counter = (ids) => <name>Ids.sync(ids)` (voir `Transformer.ts` comme modèle).
- **API draw uniforme** : chaque `*Preview` expose `drawBefore(ctx, …)` **et** `drawAfter(ctx, …)`. Le contenu va dans celui qui correspond au timing global (avant ou après le dessin des tokens), l'autre reste vide.

## Gabarit base (`<Name>.ts`)

```ts
import { createIdCounter } from "../idCounter"

const magnetIds = createIdCounter("magnet")
export const syncMagnetCounter = (ids: string[]) => magnetIds.sync(ids)

export class Magnet {
  id: string
  linkId: string
  screenId: string = "main"
  constructor(linkId: string, id?: string, screenId?: string) {
    this.id = id ?? magnetIds.next()
    this.linkId = linkId
    if (screenId) this.screenId = screenId
  }
}
```

## Gabarit editor (`<Name>Editor.ts`)

```ts
import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { RADII } from "../../theme"
import { Magnet } from "./Magnet"

export class MagnetEditor extends Magnet {
  draw = (ctx: Renderer, pt: Point) => {
    ctx.fillStyle = "#888"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, RADII.node, 0, Math.PI * 2)
    ctx.fill()
  }
}
```

## Gabarit preview (`<Name>Preview.ts`)

Le `*Preview` sépare le **dessin statique** (`drawStatic`) des **animations** via l'interface `Animation` + `runAnimations` (ne PAS réinliner la boucle d'animation à la main). Modèle simple : `InverterPreview.ts` ; modèle animé complet : `TransformerPreview.ts`.

```ts
import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { COLORS } from "../../theme"
import { Magnet } from "./Magnet"

export class MagnetPreview extends Magnet {
  private _pt: Point | null = null

  private drawStatic = (_ctx: Renderer) => {
    // formes fixes (peut être vide si tout est animé)
  }

  private animPulse = (ctx: Renderer, _elapsed: number) => {
    if (!this._pt) return
    // animation, capture this pour lire l'état de l'entité
  }

  readonly animations: Animation[] = [
    { draw: (ctx, t) => this.animPulse(ctx, t.elapsed) },
  ]

  // Contenu dans drawBefore OU drawAfter selon le timing global ; l'autre reste vide.
  drawBefore = (_ctx: Renderer, _pt: Point) => {}

  drawAfter = (ctx: Renderer, pt: Point, elapsed = 0) => {
    this._pt = pt
    this.drawStatic(ctx)
    runAnimations(this.animations, ctx, elapsed)
  }
}
```

## Branchement (obligatoire)

1. `packages/engine/src/Manager/EditorManager.ts` : importer `<Name>Editor`, l'ajouter au paramètre/champ correspondant (suivre le pattern des `transformers`/`inverters`) — **uniquement les `*Editor`**.
2. `packages/engine/src/Manager/PreviewManager.ts` : `initSimulation` construit les `*Preview` depuis les data brutes — brancher `<Name>Preview` là, et ajouter la passe de dessin voulue dans la séquence `drawAllPreview` — **uniquement les `*Preview`**.
3. `packages/engine/src/Map/mapJson.ts` :
   - importer `{ <Name>, sync<Name>Counter }` (+ le type union éventuel) ;
   - ajouter la clé au type `MapJson` et à `serializeMap` ;
   - reconstruire les instances dans `deserializeMap` puis appeler `sync<Name>Counter(Object.keys(<names>))` (calque exact du bloc `transformers`).
4. Ajouter la clé dans `packages/maps/map.json` (tableau vide au minimum) et étendre `validate-map` si l'entité introduit une nouvelle contrainte de cohérence.

## Après scaffold

Lancer `node .claude/skills/check-engine-purity/check-engine-purity.mjs` puis `yarn lint`.

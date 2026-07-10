# entities/ — toutes les entités métier de l'engine

## Structure

Chaque entité suit le pattern à 3 niveaux :

```
Foo/
  Foo.ts          ← base : data pure, constructeur, compteur d'ID. Zéro draw.
  FooEditor.ts    ← draw éditeur (dashed, handles, overlays). Utilisé par EditorManager.
  FooPreview.ts   ← draw simulation (rendu final). Utilisé par PreviewManager.
```

## Entités

| Dossier | Rôle |
|---|---|
| `Arrival/` | Point d'arrivée — anneau + token demandé. Vérifie couleur ET type du token entrant. |
| `Inverter/` | Nœud sur un link — toggle `isInverted / isGrayscale / isDark` quand un token le traverse. |
| `Line/` | Segment de rail (straight, bezier, sine, spiral). Contient les `points[]` précalculés et `screenId`. |
| `Link/` | Connexion entre deux endpoints de lignes. `activated` contrôle si les tokens peuvent passer. |
| `ScreenGate/` | Portail vers un écran imbriqué. `entryKey` / `exitKey` = endpoints de téléportation. |
| `Start/` | Point de spawn des tokens. `delay` = intervalle entre tokens, `firstDelay` = délai du premier. |
| `Switch/` | Nœud de branchement. Le joueur clique pour cycler entre les links actifs. |
| `Token/` | Balle colorée. `type` = round ou square. Avance via `advance()`, change de ligne via `transition()`. |
| `Transformer/` | Nœud sur un link — change couleur, forme ou opacité du token qui passe (avec animation). |

## Règles

- **Zéro draw dans la base** — `Foo.ts` ne contient jamais de méthode draw.
- **API draw uniforme** — chaque `*Preview` expose `drawBefore(ctx, ...)` + `drawAfter(ctx, ...)`. Le contenu va dans celui qui correspond au timing global (avant ou après les tokens), l'autre est vide.
- **Cross-entity** — les imports entre entités du même dossier utilisent des chemins relatifs (`../OtherEntity/`).
- **Zéro React, zéro DOM** — tout le code cible l'interface `Renderer` (`../render/Renderer.ts`).

## Timing drawBefore / drawAfter dans drawAllPreview

```
drawBefore :  Line · Switch · Transformer · Arrival (vide, stocke pt) · Start (vide)
              ↓ tokens ↓
drawAfter  :  Line · Switch · Start (countdown) · Arrival (anneau + démande, dessiné après pour passer sous le token) · ScreenGate · Inverter
```

## Structure interne des *Preview — Animation

Chaque `*Preview` sépare le dessin statique des animations via l'interface `Animation` (`Animation.ts`) :

```typescript
// Animation.ts
type AnimTime = { elapsed: number; now: number }
interface Animation { draw(ctx: Renderer, t: AnimTime): void }
export const runAnimations = (animations: Animation[], ctx: Renderer, elapsed = 0) => { /* boucle t + anim.draw */ }

// Dans chaque *Preview :
private drawStatic = (ctx) => { /* formes fixes */ }
private animFoo    = (ctx) => { /* animation capturant this */ }

readonly animations: Animation[] = [
  { draw: (ctx, t) => this.animFoo(ctx, t.elapsed) },
]

drawBefore = (ctx, ...) => {
  // stocker l'état transitoire (this._pt, etc.)
  this.drawStatic(ctx)
  runAnimations(this.animations, ctx, elapsed)
}
```

`runAnimations` (dans `Animation.ts`) factorise la boucle `{elapsed, now: Date.now()} + for (anim of animations) anim.draw(ctx, t)` — ne pas la réinliner manuellement dans un nouveau `*Preview`.

- `t.elapsed` = secondes simulation (passé par le manager via `elapsedSeconds`)
- `t.now` = `Date.now()` pour les animations temps-réel (pulse token, cop flash)
- Les animations capturent `this` pour accéder à l'état de l'entité
- `drawStatic` vide = acceptable si tout est animé (ex: Token, Inverter)
- **Cas Line** : glow est un overlay → `drawStatic` (rail gris) en premier, puis animations (trait jaune par-dessus)

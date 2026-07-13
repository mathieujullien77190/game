# entities/ — entités métier de l'engine

Chaque entité suit le pattern à 3 niveaux :
- `Foo.ts` — base : data pure, constructeur, compteur d'ID. **Zéro draw.**
- `FooEditor.ts` — rendu éditeur (dashed, poignées). Utilisé par `EditorManager`.
- `FooPreview.ts` — rendu simulation. Utilisé par `PreviewManager`.

Quelques entités ajoutent un 4ᵉ fichier de helpers (`switchUtils.ts`, `demandShape.ts`) ; Link n'a qu'un fichier, Token n'a pas d'Editor.

## Entités
| Dossier | Rôle |
|---|---|
| `Arrival/` | Point d'arrivée — anneau + demandes. Vérifie couleur ET type ET orientation. |
| `Cloner/` | Duplique un token vers toutes ses sorties activées. |
| `Inverter/` | Toggle un effet plein écran (invert/grayscale/dark) au passage d'un token. |
| `Line/` | Rail (straight, curve, sine, elbow, spiral) + `points[]` précalculés. |
| `Link/` | Connexion entre deux endpoints de lignes ; `activated` contrôle le passage. |
| `ScreenGate/` | Portail vers un écran imbriqué (téléportation entry/exit). |
| `Start/` | Spawn des tokens (`delay` / `firstDelay`). |
| `Switch/` | Aiguille cliquable ; cycle la sortie active. |
| `Token/` | Balle colorée. Avance + routage via `transition()`. |
| `Transformer/` | Change couleur/forme/opacité du token qui passe. |

## Règles
- **Zéro draw dans la base**, **zéro React, zéro DOM** — tout cible l'interface `Renderer`.
- Imports cross-entity en relatif (`../Autre/`).
- La mécanique de simulation (matching, transformation, téléportation, duplication, inversion) vit dans **`TokenPreview.transition()`** — les `*Preview` des nœuds ne font que du rendu.
- Animations : les `*Preview` déclarent un tableau `animations` exécuté par `runAnimations` (`Animation.ts`) ; helpers de rendu réutilisables dans `Utils/anim.ts`. Le flag global `PreviewManager.animationsEnabled` (porté par `Animation.ts`) coupe en une ligne tout ce qui est déclaré dans les `animations[]`, sans toucher au rendu statique.

# Tickwire

Jeu de routage de balles : des tokens colorés voyagent sur des lignes, traversent des écrans imbriqués, changent de couleur/forme via des transformers, et doivent atteindre l'arrivée dans le bon état. Inclut un éditeur de niveaux (dessin de lignes, placement d'entités, import/export JSON) et un mode preview (simulation temps réel).

Monorepo yarn workspaces : `packages/engine` (logique + rendu SVG), `packages/game` (app React Native), `packages/edition` (éditeur).

## Commandes

```bash
yarn dev        # lance l'éditeur (edition)
yarn edition    # idem
yarn game       # lance le jeu (game)
yarn engine     # typecheck de l'engine
```

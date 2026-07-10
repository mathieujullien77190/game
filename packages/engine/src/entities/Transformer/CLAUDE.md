# Transformer/ — nœud de transformation sur un link

## Structure

- `Transformer.ts` — base : `id` (`createIdCounter("transform")`), `linkId`, `type: "fade" | "rotate" | "color" | "shape"`, `amount`, `color`, `targetType`, `screenId`. Une instance ne porte qu'**un seul** effet (`type`) — l'application réelle sur le token traversant vit dans `TokenPreview.transition()` (voir `Token/CLAUDE.md`), pas ici.
- `TransformerEditor.ts` — exporte `TYPE_COLOR` (map `type → hex`), seule source de vérité pour les 4 couleurs, réutilisée par `EditorManager` à la fois pour le nœud placé (alpha réduit au survol) et pour le ghost-preview au moment de choisir un type.
- `TransformerPreview.ts` — l'animation de "peinture" du token qui traverse.

## Fonctionnement

- `transformProgress` : `-1` = idle (aucun token en cours de transformation), `0..1` = animation en cours, mis à jour par `PreviewManager.tickSim` en recopiant le `transformProgress` du token en train de traverser (`PAINT_DURATION`, voir `constants.ts`).
- `currentTokenColor` : uniquement pour `type === "color"`, permet au point orbital d'afficher la couleur réelle du token en cours de repeinte plutôt que la couleur cible du transformer.
- Rendu : `drawBefore` = base statique (disque blanc + glyphe central selon `type` : pastille colorée pour `color`, mini-forme cible pour `shape`, pastille assombrie selon `amount` pour `fade`) ; `drawAfter` = partie animée — point orbital (`orbitDot`) qui tourne lentement en idle (`dotAngle` basé sur `elapsedSeconds`) ou rapidement en synchro avec `transformProgress`, avec une traînée qui s'estompe (`trailArcs`).
- Cas `rotate` à part : pas de pause du token (`transition()` ne bloque jamais sur `rotate`, contrairement à `color`/`shape`/`fade`), donc pas de `transformProgress` à suivre — le visuel est 3 flèches statiques qui tournent en continu (`this._elapsed * Math.PI * 1.4`), indépendamment de tout passage de token.

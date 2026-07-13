---
name: validate-map
description: Valide la cohérence d'un map.json avant import/simulation — ids uniques, links référençant des lines existantes, composants (transformer/inverter/switch/gate/cloner) pointant un linkId valide, arrivals avec demands color+type, screenTimeMultipliers ⊆ screens. Déclencheurs — "valider la map", "map cassée", "vérifier map.json", avant d'importer une map ou après édition manuelle du JSON.
---

# validate-map

Vérifie qu'un `map.json` est cohérent **avant** de le simuler. Cible les pièges du CLAUDE.md :

- les `linkId` dérivent de l'**ordre du tableau `lines`** → un composant peut pointer un linkId qui n'existe plus après réordonnancement ;
- les composants (transformer, inverter, switch, screenGate, cloner) sont **nommés par leur linkId** ;
- une `arrival` exige des `demands` avec `color` **ET** `type` (sinon le token n'est jamais accepté).

## Lancer

```bash
# map par défaut (packages/maps/map.json)
node .claude/skills/validate-map/validate-map.mjs

# une autre map
node .claude/skills/validate-map/validate-map.mjs packages/maps/map2.json
```

Exit `0` = valide (avertissements possibles), `1` = erreur(s) bloquante(s), `2` = JSON illisible.

## Ce qui est vérifié

| Niveau | Contrôle |
|---|---|
| ❌ erreur | line/link id dupliqué ; link → line inexistante ; composant → linkId/lineId inexistant ; arrival → lineId inexistant ; demand sans color/type |
| ⚠️ warning | clé top-level manquante ; screenId / screenTimeMultipliers hors `screens` ; 0 ou >1 start ; arrival sans demand |

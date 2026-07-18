---
name: commit
description: Commit les modifs en cours avec un message selon la convention du repo (français, sujet concis à l'impératif, corps à puces si le « pourquoi » n'est pas évident) + trailer Co-Authored-By. Déclencheurs — "commit", "commit les modifs", "commit ça", "fais un commit", "commit avec un message".
---

# commit

Crée **un** commit propre des modifications en cours. Un message peut être passé en argument ; sinon, le générer à partir du diff.

## Étapes

1. **Contexte** — `git status` + `git diff HEAD` (relire ce qui est réellement modifié, ne pas commiter à l'aveugle).
2. **Branche** — si sur `main`, créer une branche d'abord. Sinon commiter sur la branche courante.
3. **Stage** — si rien n'est encore staged, `git add -A` (ou seulement les fichiers pertinents si le diff mélange des choses sans rapport — demander en cas de doute).
4. **Message** — rédiger selon la convention ci-dessous.
5. **Commit** — via heredoc (message multi-ligne), avec le trailer obligatoire.
6. **Confirmer** — afficher le hash + `git status` propre. **Ne pas push** sauf demande explicite.

## Convention de message

- **Français**, comme tout le repo (code/commits/PRs).
- **Sujet** : impératif court (≤ ~60 car), minuscule, sans point final. Ex. `uniformise la couche animation`, `corrige le décalage de la traînée boost`.
- **Préfixe optionnel** type Conventional Commits (`feat:`, `fix:`, `refactor:`) si ça clarifie — pas obligatoire.
- **Corps** (facultatif) : uniquement si le « pourquoi » ou le périmètre n'est pas évident au sujet seul. Puces courtes, groupées par thème si plusieurs sujets.
- Décrire **ce que** ça change et **pourquoi**, pas le détail ligne à ligne.

## Trailer obligatoire

Terminer **tout** message par une ligne vide puis :

```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

## Gabarit d'exécution

```bash
git commit -m "$(cat <<'EOF'
<sujet impératif court>

- <point 1 : quoi + pourquoi>
- <point 2>

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

Pour un changement trivial (un seul sujet clair), sujet seul suffit — pas de corps.

## Règles

- **Un seul commit** par invocation (pas d'amend d'un commit existant sauf demande).
- Ne jamais `--no-verify` ni contourner les hooks/la signature.
- Ne pas push, ne pas ouvrir de PR sauf demande explicite.
- Si le diff est vide → le signaler, ne rien commiter.

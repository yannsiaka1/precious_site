# Comment on travaille sur ce dépôt

Site de production, déployé automatiquement sur Vercel à chaque fusion dans
`main`. Un commit poussé sur `main` est en ligne quelques minutes plus tard,
devant de vrais clients. D'où les règles ci-dessous : elles existent pour que
rien n'atteigne la production sans avoir été lu.

## Le cycle

```
main ──┬─────────────────────────────────── fusion ──→ déploiement Vercel
       └── branche de travail ── PR ── relecture ──┘
```

1. **Une branche par sujet**, partant de `main` à jour.
2. **Une PR dès le premier commit**, même inachevée — en brouillon si le
   travail continue. Une PR ouverte tôt se relit par petits bouts ; une PR
   ouverte à la fin se relit mal ou pas du tout.
3. **Relecture.** Rien ne part en production sans avoir été regardé par
   quelqu'un d'autre que son auteur.
4. **Corrections** en commits supplémentaires sur la même branche, pas en
   réécriture de l'historique : le relecteur doit pouvoir voir ce qui a changé
   depuis sa remarque.
5. **Fusion** une fois la PR approuvée et la construction verte.
6. **Suppression de la branche** après fusion.

On ne pousse jamais directement sur `main`, sauf incident de production avéré
— et dans ce cas on ouvre la PR après coup, pour que la correction soit tracée.

## Nommer une branche

`type/description-courte-en-minuscules`

| Type       | Pour                                                      |
| ---------- | --------------------------------------------------------- |
| `feat`     | une fonctionnalité visible pour le visiteur                |
| `fix`      | une correction de comportement                             |
| `perf`     | une amélioration de performance sans changement visible    |
| `refactor` | une réorganisation du code, sans effet observable          |
| `docs`     | la documentation, les textes du site, les pages légales    |
| `chore`    | l'outillage, les dépendances, la configuration             |

Exemples : `feat/galerie-videos`, `fix/debordement-horizontal-iphone`,
`docs/politique-de-confidentialite`.

## Écrire un message de commit

```
type: description a l'infinitif ou au substantif, en minuscules

Le corps explique POURQUOI, pas quoi — le diff dit deja quoi. Il repond a
la question que se posera quelqu'un dans six mois : « pourquoi ce choix
bizarre ? ». Lignes a 72 caracteres.

Sans accents dans le message, pour rester coherent avec l'historique du
depot.
```

Un titre de 72 caractères au plus, pas de point final.

Le corps n'est pas obligatoire pour un changement évident (`chore: mise a jour
des dependances`). Il l'est dès qu'un choix a été fait : une valeur de seuil,
un contournement, un compromis, une solution qui surprend.

Le préfixe de type n'est pas de la décoration : il permet de générer un
journal des versions automatiquement le jour où on en veut un, et il force à
se demander ce qu'on est réellement en train de faire avant de committer.

## Avant d'ouvrir une PR

```bash
npm run build     # construction complete, y compris le prerendu
npx eslint .      # aucune erreur
```

Et, pour tout ce qui touche à l'affichage, une vérification sur une largeur de
téléphone — 390 px au minimum, 320 px si la modification touche une liste ou
un tableau. Le site a déjà eu un débordement horizontal sur iPhone passé
inaperçu pendant des semaines.

## La relecture

Le relecteur vérifie, dans cet ordre :

1. **Le comportement** — est-ce que ça fait ce que la PR annonce ?
2. **Les cas limites** — téléphone étroit, texte long, champ vide, réseau lent.
3. **La lisibilité** — est-ce qu'un tiers comprendra ce code dans six mois ?
4. **Le périmètre** — la PR ne contient-elle que ce qu'elle annonce ?

Une remarque de relecture est une question, pas un ordre. L'auteur peut y
répondre par un changement ou par une explication.

## Ce qu'on ne met pas dans le dépôt

Clés d'API, jetons, mots de passe, adresses de production privées. Tout cela
vit dans les variables d'environnement Vercel. Le fichier `.gitignore` couvre
`.env*`, mais la vigilance passe avant le filet.

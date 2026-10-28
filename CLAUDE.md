# Repères pour ce dépôt

Site vitrine de Precious — jus naturels, mocktails et cocktails, bouchées,
formations. Montréal. En production sur https://precious-jus.com.

## Avant toute chose

Lire `CONTRIBUTING.md`. Le cycle de travail y est décrit et s'applique sans
exception : branche, PR, relecture, fusion. **Jamais de push direct sur
`main`.**

## La pile

Vite 8 · React 19 · TypeScript strict · Tailwind v4 · `vite-react-ssg` en mode
page unique · ESLint 9. Déploiement Vercel, une fonction Edge dans `api/`.

Le site est prérendu : `index.html` contient le contenu complet, React reprend
ensuite la main. Ajouter une route demanderait de changer de mode de
génération — ce qui est rarement justifié. Les pages légales sont des fichiers
statiques dans `public/`, servis tels quels, avec `cleanUrls` pour l'adresse.

## Où vivent les choses

| Chemin                   | Contenu                                          |
| ------------------------ | ------------------------------------------------ |
| `src/content/`           | Tous les textes et données. Rien n'est écrit en dur dans un composant. |
| `src/components/sections/` | Une section de page par fichier                |
| `src/components/ui/`     | Les briques réutilisées                          |
| `api/contact.ts`         | Réception des formulaires, envoi des courriels    |
| `public/assets/galerie/` | Photos de la galerie, en WebP                    |
| `scripts/`               | Étapes de construction maison                     |

Pour changer un texte, une adresse, un tarif : `src/content/`, pas un
composant.

## Règles de la maison

**Tout est commenté en français**, et les commentaires disent *pourquoi*, pas
*quoi*. Le dépôt est tenu pour qu'un tiers puisse le reprendre.

**Les messages de commit sont sans accents**, pour rester cohérents avec
l'historique existant. Les commentaires de code, eux, sont accentués
normalement.

**Aucun service tiers côté client.** Pas d'analytique, pas de pixel, pas de
police distante. La politique de sécurité du contenu est verrouillée sur
`default-src 'self'` et le site ne dépose aucun témoin — c'est volontaire, et
c'est ce qui permet de se passer de bandeau de consentement. Toute dépendance
externe ajoutée casse cet équilibre et doit être discutée.

**Les images de galerie** font 820×615 en WebP, 80 Ko visés, et portent
`loading="lazy"`. Le carrousel les affiche en `object-cover` : un fichier d'un
autre format y sera rogné au centre par le navigateur.

Une exception existe, et elle est volontaire. La visionneuse, elle, affiche en
`object-contain` — donc le fichier entier. Une photo verticale dont le sujet ne
survit pas à un recadrage en 4:3 est donc stockée dans sa proportion d'origine :
le carrousel en montre la bande centrale, la visionneuse la montre entière.
Un portrait comptant plus de pixels, le plafond passe à 90 Ko pour ces
fichiers-là. `cocktails-20` est le seul dans ce cas à ce jour.

**Rien n'est inventé dans les contenus.** Tarifs, adresses, témoignages,
délais : si l'information n'a pas été fournie, on ne la met pas et on la
demande. Les témoignages du site sont de vrais avis.

## Vérifications attendues

```bash
npm run build     # construction complete, prerendu compris
npx eslint .      # doit etre silencieux
```

Pour tout changement d'affichage, vérifier à 390 px de large au minimum. Le
site a déjà laissé passer un débordement horizontal sur iPhone.

## Points connus, non traités

- La limite de débit du formulaire utilise un magasin partagé **si**
  `KV_REST_API_URL` et `KV_REST_API_TOKEN` existent. Sans magasin attaché, elle
  retombe sur un compteur en mémoire, qui ne garantit rien. À brancher avant
  toute campagne publicitaire.
- `api/contact.ts` et `Contact.tsx` sont longs et mériteraient d'être
  découpés.
- Aucun test automatisé.
- Le septième point de vente s'appelle encore « Local 108 », en attente de son
  enseigne réelle.

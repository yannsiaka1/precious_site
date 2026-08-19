# Precious — site vitrine

Site vitrine une page pour la marque Precious : jus naturels, donuts artisanaux,
cocktails événementiels, formation et guide.

## Stack

| Choix | Pourquoi |
| --- | --- |
| **Vite + React 19 + TypeScript** | SPA, rechargement instantané, découpage en composants |
| **vite-react-ssg** | Le build génère un `index.html` complet : Google et les aperçus de partage voient le contenu, puis React reprend la main |
| **Tailwind CSS v4** | Styles au plus près du composant ; tokens de design centralisés dans `@theme` |

## Démarrer

```bash
npm install
npm run dev      # développement
npm run build    # build + prérendu dans dist/
npm run preview  # prévisualiser le build
npm run lint
```

Node 20 ou plus.

## Organisation

```
src/
├── content/          Tout l'éditorial (textes, offres, coordonnées)
├── components/
│   ├── ui/           Primitives réutilisables (Button, Section, Reveal…)
│   ├── layout/       Header, Footer
│   └── sections/     Une section de page = un composant
├── hooks/            useInView (apparitions au scroll)
├── lib/              cn, envoi du formulaire
└── styles/index.css  Tokens de design + base + animations
```

**Règle de travail :** modifier un texte, un prix ou une offre ne doit jamais
demander de toucher à un composant. Tout le contenu vit dans `src/content/`.
De même, aucune couleur en dur dans le JSX : tout vient de `@theme`.

## À compléter avant la mise en ligne

1. **Coordonnées** — `src/content/site.ts`. Le courriel est confirmé
   (`Preciousck384@gmail.com`). Le téléphone `+1 514 977-2775` a été relevé sur
   les affiches « Bar à jus » des photos fournies : **à confirmer**. L'adresse
   postale reste à arrêter (elle alimente aussi le JSON-LD dans `index.html`).
2. **Liens Payhip** — champ `url` des deux offres dans
   `src/content/offerings.ts`. Tant qu'il est vide, la carte renvoie vers le
   formulaire au lieu d'afficher un bouton mort.
3. **Réseaux sociaux** — `site.social`. Facebook et TikTok sont branchés ;
   Instagram reste grisé tant que la page n'existe pas.
7. **Témoignages** — `src/content/offerings.ts`. Les trois avis viennent des
   maquettes, pas de clients identifiés : à remplacer par de vrais avis, avec
   l'accord des personnes citées.
8. **Domaine** — remplacer `https://precious-jus.com/` dans `index.html`,
   `public/robots.txt` et `public/sitemap.xml` par le domaine réel.
4. **Formulaires** — voir la section « Recevoir les demandes » ci-dessous.
5. **Images** — celles de `public/assets` sont encore recadrées depuis les
   maquettes Figma. À remplacer par les photos et visuels détourés d'origine.
6. **Mentions légales et politique de confidentialité** — le formulaire collecte
   des données personnelles ; au Québec, la loi 25 encadre cette collecte.


## Recevoir les demandes par courriel

Les quatre formulaires du site (les trois commandes, le contact, l'avis et le
champ de rappel du pied de page) envoient tous vers la même fonction
serverless : `api/contact.ts`, servie par Vercel à l'adresse `/api/contact`.

La clé du service d'envoi et l'adresse de destination vivent côté serveur.
Elles ne sont jamais présentes dans le JavaScript envoyé au navigateur — c'est
la raison d'être de cette fonction plutôt qu'un appel direct depuis la page.

### Choisir le service d'envoi

Deux services sont pris en charge. La fonction utilise **Brevo** si
`BREVO_API_KEY` est défini, sinon **Resend**.

| | Resend | Brevo |
| --- | --- | --- |
| Écrire à n'importe quelle adresse | domaine à vérifier | **adresse d'expéditeur à valider** |
| Sans domaine | uniquement vers le titulaire du compte | vers qui l'on veut |
| Gratuit | 100 courriels/jour | 300 courriels/jour |

**Sans domaine, Brevo est le choix pratique** : on valide une simple adresse
d'expéditeur (un Gmail suffit) et l'envoi devient possible vers n'importe quel
destinataire.

#### Brevo

1. Compte sur [brevo.com](https://www.brevo.com).
2. *Senders, Domains & Dedicated IPs → Senders → Add a sender* : ajouter
   `Preciousck384@gmail.com` et cliquer le lien de confirmation reçu.
3. *SMTP & API → API Keys* : créer une clé.
4. Variables Vercel :

   | Nom | Valeur |
   | --- | --- |
   | `BREVO_API_KEY` | la clé créée |
   | `CONTACT_FROM` | `Precious <Preciousck384@gmail.com>` |
   | `CONTACT_TO` | `Preciousck384@gmail.com` |

5. Redéployer.

#### Resend (mise en service d'origine, environ 10 minutes)

1. Créer un compte sur [resend.com](https://resend.com) **avec l'adresse
   `Preciousck384@gmail.com`**. Sans domaine vérifié, Resend n'autorise l'envoi
   que vers l'adresse du titulaire du compte : c'est justement celle qui doit
   recevoir les demandes.
2. Générer une clé d'API (*API Keys → Create*).
3. Dans Vercel, *Settings → Environment Variables*, ajouter :

   | Nom | Valeur |
   | --- | --- |
   | `RESEND_API_KEY` | la clé générée |
   | `CONTACT_TO` | `preciousck384@gmail.com` — **en minuscules**, exactement l'adresse d'inscription du compte Resend |
   | `CONTACT_FROM` | `Precious <onboarding@resend.dev>` |

   ⚠️ Tant qu'aucun domaine n'est vérifié, Resend compare `CONTACT_TO` à
   l'adresse du compte **caractère par caractère** : une majuscule suffit à
   faire refuser l'envoi. La fonction ramène désormais l'adresse en minuscules
   par précaution.

4. Redéployer. Les demandes arrivent alors dans la boîte de réception, et
   **répondre au courriel répond directement au client** (`reply_to`).

Le jour où le domaine sera en place, le vérifier dans Resend et remplacer
`CONTACT_FROM` par une adresse du domaine (`site@precious-jus.com`). L'envoi
devient alors possible vers n'importe quelle adresse et passe mieux les filtres
anti-pourriel.

### Tant que la clé n'est pas renseignée

La fonction répond 501 et le site bascule automatiquement sur la messagerie du
visiteur, avec la demande pré-remplie. Aucune saisie n'est perdue, et le
message de confirmation le dit honnêtement : « prêt à partir », pas « envoyé ».

### En développement local

`npm run dev` ne sert pas les fonctions serverless : les formulaires
retomberont donc sur la messagerie. Pour les tester en conditions réelles :

```bash
npm i -g vercel
vercel dev
```

### Envoyer sans domaine vérifié : Brevo

Resend n'accepte d'écrire qu'au titulaire du compte tant qu'aucun domaine
n'est vérifié. Pour envoyer vers n'importe quelle adresse sans domaine, la
fonction sait aussi passer par [Brevo](https://www.brevo.com) :

1. Créer un compte, puis *Senders & IP* → ajouter l'adresse d'expédition et
   cliquer le lien de confirmation reçu par courriel.
2. Générer une clé d'API.
3. Ajouter dans Vercel :

   | Nom | Valeur |
   | --- | --- |
   | `BREVO_API_KEY` | la clé générée |
   | `CONTACT_FROM` | `Precious <adresse-validee@exemple.com>` |
   | `CONTACT_TO` | l'adresse qui reçoit |

Si `BREVO_API_KEY` est présente, elle prend le pas sur Resend. Aucun autre
changement n'est nécessaire : validation, mise en forme et réponse sont
identiques.

### Autre service d'envoi

Un `.env` avec `VITE_CONTACT_ENDPOINT=https://…` détourne les formulaires vers
n'importe quelle autre destination (Formspree, n8n, une API maison) sans
toucher au code. La fonction `api/contact.ts` est alors inutilisée.

### Diagnostiquer un refus du service d'envoi

Message « Le service d'envoi a refusé la demande » : la demande est valide et
a bien atteint Resend, c'est Resend qui refuse. La cause exacte se lit dans
**Vercel → le projet → Logs**, filtre `/api/contact` :

```
[contact] Resend a refusé l'envoi — HTTP 403 — {"message":"..."}
[contact] Cause probable : ...
```

Pour la voir directement dans la réponse pendant la mise en service, ajouter
`DEBUG_CONTACT=1` aux variables Vercel puis redéployer. **À retirer une fois
le circuit établi** : ces détails ne regardent pas les visiteurs.

Les trois causes courantes :

| Message de Resend | Correctif |
| --- | --- |
| *You can only send testing emails to your own email address* | `CONTACT_TO` doit être exactement l'adresse d'inscription du compte Resend |
| *The … domain is not verified* | remettre `CONTACT_FROM` sur `Precious <onboarding@resend.dev>` |
| *API key is invalid* | régénérer la clé, la recoller sans espace, cocher l'environnement Production |

### Ce que la fonction contrôle

- méthode POST uniquement ;
- champ piège invisible (`website`) : réponse 200 sans envoi, l'automate ne
  sait pas qu'il a été repéré ;
- délai de remplissage entre 1,5 s et 12 h — **mesuré par le navigateur** et
  transmis, jamais calculé en comparant l'heure du client à celle du serveur :
  les deux horloges n'ont aucune raison d'être synchronisées ;
- 12 envois maximum par adresse IP sur 10 minutes, comptés uniquement pour les
  demandes valides — une erreur de saisie ne consomme pas le quota. Limite en
  mémoire, donc propre à chaque instance : une gêne, pas une garantie. La marge
  est large car les opérateurs mobiles partagent une même adresse IP entre de
  nombreux abonnés ;
- longueurs bornées, caractères de contrôle et chevrons retirés ;
- format de l'adresse courriel, nom d'au moins 2 caractères, message d'au
  moins 5 caractères ;
- échappement HTML de toutes les valeurs insérées dans le courriel.

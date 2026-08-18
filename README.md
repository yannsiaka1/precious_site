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
4. **Formulaire** — par défaut il ouvre la messagerie du visiteur. Pour un envoi
   serveur, créer un `.env` :

   ```
   VITE_CONTACT_ENDPOINT=https://…
   ```

   L'endpoint reçoit un POST JSON (`name`, `email`, `phone`, `subject`, `date`,
   `message`). Le reste du code n'a pas à changer.
5. **Images** — celles de `public/assets` sont encore recadrées depuis les
   maquettes Figma. À remplacer par les photos et visuels détourés d'origine.
6. **Mentions légales et politique de confidentialité** — le formulaire collecte
   des données personnelles ; au Québec, la loi 25 encadre cette collecte.

import type { NavLink } from "./types";

/**
 * Informations de la marque.
 *
 * ⚠️ À CONFIRMER AVANT MISE EN LIGNE — les maquettes contiennent trois
 * variantes contradictoires (adresse, courriel en .fr/.com, deux numéros).
 * Une seule version doit survivre ici, et elle doit être exacte : c'est
 * l'information sur laquelle un client va vous joindre.
 */
export const site = {
  name: "Precious",
  tagline: "Naturellement bon",
  /** Phrase de positionnement, réutilisée en méta-description et dans le footer. */
  promise:
    "Jus naturels, donuts artisanaux et cocktails sans alcool sur mesure, à Montréal.",
  contact: {
    email: "Preciousck384@gmail.com",
    phone: "+1 514 977-2775",
    area: "Montréal et environs",
    availability: "Sur commande et sur rendez-vous",
  },
  /**
   * Détaillants où trouver les jus. Noms et adresses fournis par Precious ;
   * le point de Sainte-Marthe-sur-le-Lac attend son enseigne.
   */
  pointsDeVente: [
    { nom: "Marché Ghanacan", adresse: "549 av. Ogilvy", ville: "Montréal" },
    { nom: "Maison Gloria", adresse: "2640 rue Bélanger", ville: "Montréal" },
    {
      nom: "Le Petit Sénégalais",
      adresse: "5176 ch. Queen-Mary",
      ville: "Montréal",
    },
    { nom: "Marché Rio", adresse: "6247 boul. Léger", ville: "Montréal-Nord" },
    {
      nom: "G.B. La Référence",
      adresse: "5852 rue Bélanger",
      ville: "Saint-Léonard",
    },
    {
      nom: "Marché Victoria",
      adresse: "577 boul. Saint-Martin O.",
      ville: "Laval",
    },
    {
      nom: "Local 108",
      adresse: "3075 ch. d'Oka",
      ville: "Sainte-Marthe-sur-le-Lac",
    },
  ],

  /** Seuls les réseaux réellement en ligne figurent ici. */
  social: [
    { label: "Facebook", href: "https://www.facebook.com/share/1BwKsN7ovA/" },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@precious100bio?_r=1&_t=ZS-98yAVVCb4hZ",
    },
    { label: "Instagram", href: "https://www.instagram.com/precious100bio/" },
  ],
} as const;

export const navigation: NavLink[] = [
  { href: "#creations", label: "Nos créations" },
  { href: "#academie", label: "Formations & ebook" },
  { href: "#maison", label: "La maison" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#contact", label: "Contact" },
];

/** Liens de bas de page hors navigation principale. */
export const footerLinks: NavLink[] = [
  { href: "#temoignages", label: "Témoignages" },
];

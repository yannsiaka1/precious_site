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
    /** ⚠️ Relevé sur les affiches « Bar à jus » de vos photos — à confirmer. */
    phone: "+1 514 977-2775",
    area: "Montréal et environs",
    availability: "Sur commande et sur rendez-vous",
  },
  /** Une entrée sans lien reste affichée, mais grisée et inactive. */
  social: [
    { label: "Facebook", href: "https://www.facebook.com/share/1BwKsN7ovA/" },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@precious100bio?_r=1&_t=ZS-98yAVVCb4hZ",
    },
    { label: "Instagram", href: "" },
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

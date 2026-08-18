export type ServiceId = "jus" | "donuts" | "evenements";

export interface Media {
  /** Chemin dans /public. */
  src: string;
  /** Description pour les lecteurs d'écran. Jamais vide sur une image porteuse de sens. */
  alt: string;
  /** Cadrage CSS `object-position`. */
  focus: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  /** Légende posée sur le bas du visuel. Facultative : toutes n'en ont pas. */
  caption?: string;
}

/** Champ d'un formulaire, propre à un service ou à un type de demande. */
export interface RequestField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "number" | "time" | "select";
  placeholder?: string;
  /** Par défaut un champ est obligatoire ; passer `false` pour l'ouvrir. */
  required?: boolean;
  /** Occupe une demi-largeur sur grand écran. */
  half?: boolean;
  /** Choix proposés lorsque `type` vaut "select". */
  options?: string[];
}

export interface Service {
  id: ServiceId;
  /** Libellé court de l'onglet. */
  tab: string;
  title: string;
  eyebrow: string;
  description: string;
  features: string[];
  /** Texte du bouton, à l'infinitif, décrivant ce qui se passe au clic. */
  action: string;
  media: Media;
  /** Visuels qui défilent à gauche quand cet univers est ouvert. */
  gallery: GalleryImage[];
  /** Champs supplémentaires du formulaire de commande. */
  fields: RequestField[];
  /** Phrase d'accroche du formulaire. */
  formIntro: string;
}

export interface Formation {
  badge: string;
  format: string;
  title: string;
  intro: string;
  /** Ce qu'on apprend, un bloc par thème. */
  modules: { title: string; detail: string }[];
  /** Informations pratiques, en une ligne chacune. */
  practical: string[];
  cta: string;
  /** URL Payhip. Chaîne vide = offre annoncée mais pas encore achetable. */
  url: string;
}

export interface Ebook {
  badge: string;
  format: string;
  title: string;
  intro: string;
  highlights: string[];
  /** Textes imprimés sur la couverture. */
  cover: { kicker: string; title: string; footer: string };
  cta: string;
  url: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export type ServiceId = "jus" | "donuts" | "evenements";

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
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "number"
    | "time"
    | "select"
    | "checkboxes";
  placeholder?: string;
  /** Par défaut un champ est obligatoire ; passer `false` pour l'ouvrir. */
  required?: boolean;
  /** Occupe une demi-largeur sur grand écran. */
  half?: boolean;
  /** Choix proposés lorsque `type` vaut "select" ou "checkboxes". */
  options?: string[];
  /** Précision affichée sous le libellé, en petits caractères. */
  hint?: string;
  /**
   * Champ qui n'apparaît que si l'option choisie correspond.
   * Sert à demander une précision quand on sélectionne « Autre ».
   */
  reveal?: { when: string; field: RequestField };
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
  /** Visuels qui défilent à gauche quand cet univers est ouvert. */
  gallery: GalleryImage[];
  /**
   * Disposition de ces visuels.
   * - "paire"  : deux photos empilées qui tournent ensemble (photos larges)
   * - "unique" : un seul visuel plein cadre (visuels produit verticaux)
   */
  galleryLayout?: "paire" | "unique";
  /** Champs supplémentaires du formulaire de commande. */
  fields: RequestField[];
  /** Phrase d'accroche du formulaire. */
  formIntro: string;
}

export interface Formation {
  id: "presentiel" | "en-ligne";
  /** Étiquette courte : « En présentiel », « En ligne ». */
  badge: string;
  /** Précision de format affichée à côté du badge. */
  format: string;
  title: string;
  intro: string;
  /** Ce que l'on apprend : le programme, un thème par ligne. */
  programme: string[];
  /** Ce qui est compris dans le prix, un élément par ligne. */
  includes: string[];
  /** Format et durée, affichés près du tarif. */
  duree: string;
  /** Tarif affiché, devise comprise. */
  price: string;
  /** Mention sous le tarif : modes de règlement, conditions. */
  priceNote: string;
  cta: string;
  /**
   * Nom accessible du bouton principal.
   *
   * Le libellé visible tient en trois mots pour que les deux boutons
   * entrent côte à côte ; hors de la carte, il ne dirait pas de quelle
   * formation il s'agit. Doit commencer par `cta` à l'identique, sans quoi
   * la commande vocale ne reconnaît plus le bouton qu'on lui nomme.
   */
  ctaAria: string;
  /** Lien de paiement Payhip. */
  url: string;
  /**
   * Second mode de règlement, quand il est offert.
   *
   * Facultatif plutôt qu'obligatoire : une formation sans plan échelonné
   * n'affiche simplement pas le second bouton, sans qu'il faille toucher au
   * composant. Chaque lien Payhip force un plan tarifaire précis — la page de
   * commande n'offre aucun choix —, d'où deux adresses distinctes.
   */
  echelonne?: {
    /** Intitulé du bouton, montant par versement compris. */
    cta: string;
    /** Nom accessible, aux mêmes conditions que `ctaAria`. */
    ctaAria: string;
    /** Lien Payhip pointant sur le plan échelonné. */
    url: string;
  };
}

/** Question courante affichée en accordéon sous les offres. */
export interface Question {
  question: string;
  reponse: string;
}

export interface Ebook {
  badge: string;
  format: string;
  title: string;
  intro: string;
  highlights: string[];
  /** Textes imprimés sur la couverture. */
  cover: { kicker: string; title: string; footer: string };
  /**
   * Conditions d'obtention du guide.
   *
   * Le guide n'est pas vendu séparément : il est remis aux personnes
   * inscrites à une formation. La section l'annonce donc explicitement et
   * renvoie vers les formations, pas vers un panier. Il n'y a par conséquent
   * ni libellé de paiement ni lien de vente à décrire ici — les anciens
   * champs `cta` et `url` n'étaient lus nulle part, et un lien de paiement
   * vide dans les données finit toujours par être branché par mégarde.
   */
  disponibilite: string;
}

export interface NavLink {
  href: string;
  label: string;
}

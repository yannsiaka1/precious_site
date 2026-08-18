import type { Ebook, Formation, Service, ServiceId } from "./types";

export const services: Service[] = [
  {
    id: "jus",
    tab: "Jus naturels",
    title: "Jus naturels",
    eyebrow: "Pressés, colorés, préparés à la commande",
    description:
      "Des boissons généreuses en saveurs, pensées pour le quotidien comme pour vos réceptions. Chaque recette est composée selon la saison et selon ce que vous servez.",
    features: [
      "Commande à l'unité ou en volume",
      "Formats individuels ou événementiels",
      "Recettes fruitées, épicées, sans sucre ajouté",
    ],
    action: "Commander des jus",
    media: {
      src: "/assets/services-jus.webp",
      alt: "Bouteilles de jus Precious au gingembre, aux fruits rouges et à la mangue",
      focus: "50% 49%",
    },
    gallery: [
      {
        src: "/assets/galerie/jus-4.webp",
        alt: "Jus de gingembre Precious servi au verre",
        caption: "Le gingembre, notre signature",
      },
      {
        src: "/assets/galerie/jus-2.webp",
        alt: "Caisse de bouteilles de jus Precious",
      },
      {
        src: "/assets/galerie/jus-1.webp",
        alt: "Jus de fruits rouges et pomme Precious",
      },
      {
        src: "/assets/galerie/jus-3.webp",
        alt: "Jus de mangue et passiflore Precious",
        caption: "Pressés, jamais dilués",
      },
    ],
    formIntro:
      "Dites-nous ce qu'il vous faut, nous revenons vers vous avec les quantités et les délais.",
    fields: [
      {
        name: "quantite",
        label: "Quantité souhaitée",
        type: "text",
        placeholder: "12 bouteilles, 5 litres…",
        half: true,
      },
      { name: "date", label: "Pour quand", type: "date", half: true },
    ],
  },
  {
    id: "donuts",
    tab: "Donuts",
    title: "Donuts artisanaux",
    eyebrow: "La touche gourmande de la maison",
    description:
      "Des assortiments à partager, à offrir ou à poser au centre de la table. Saveurs, glaçages et quantités sont arrêtés avec vous selon l'occasion.",
    features: [
      "Boîtes assorties de 6, 12 ou 24",
      "Créations pour anniversaires et célébrations",
      "Glaçages et garnitures personnalisables",
    ],
    action: "Commander des donuts",
    media: {
      src: "/assets/services-donuts.webp",
      alt: "Assortiment de donuts glacés au chocolat, à la fraise et au sucre",
      focus: "50% 39%",
    },
    gallery: [
      {
        src: "/assets/galerie/donuts-1.webp",
        alt: "Boîte de donuts assortis Precious",
        caption: "Des donuts faits avec amour",
      },
      {
        src: "/assets/galerie/donuts-3.webp",
        alt: "Trois donuts glacés Precious",
      },
      {
        src: "/assets/galerie/donuts-2.webp",
        alt: "Donuts sucrés sur une assiette",
        caption: "Moelleux, généreux, jamais tristes",
      },
    ],
    formIntro: "Parlez-nous de l'occasion : nous composons la boîte avec vous.",
    fields: [
      {
        name: "quantite",
        label: "Nombre de donuts",
        type: "text",
        placeholder: "6, 12, 24…",
        half: true,
      },
      { name: "date", label: "Pour quand", type: "date", half: true },
    ],
  },
  {
    id: "evenements",
    tab: "Cocktails & événements",
    title: "Cocktails & événements",
    eyebrow: "Une expérience pensée pour vos invités",
    description:
      "Precious compose et sert des cocktails sans alcool accordés à votre thème, à vos couleurs et à vos invités — du premier échange jusqu'au service, le jour venu.",
    features: [
      "Création de carte sur mesure",
      "Service et mise en scène sur place",
      "Mariages, anniversaires, événements d'entreprise",
    ],
    action: "Demander un devis",
    media: {
      src: "/assets/services-evenements.webp",
      alt: "Table de cocktails sans alcool dressée lors d'un événement Precious",
      focus: "50% 40%",
    },
    gallery: [
      {
        src: "/assets/galerie/cocktails-7.webp",
        alt: "Bar à jus Precious dressé pour une réception",
        caption: "Votre bar, à vos couleurs",
      },
      {
        src: "/assets/galerie/cocktails-3.webp",
        alt: "Flûtes de cocktail aux pétales de fleurs",
      },
      {
        src: "/assets/galerie/cocktails-9.webp",
        alt: "Cocktails colorés alignés sur un présentoir",
      },
      {
        src: "/assets/galerie/cocktails-5.webp",
        alt: "Cocktails aux myrtilles et verrines de mangue",
        caption: "Chaque carte est composée sur mesure",
      },
      {
        src: "/assets/galerie/cocktails-4.webp",
        alt: "Verrines de mangue et fraises fraîches",
      },
      {
        src: "/assets/galerie/cocktails-8.webp",
        alt: "Sculpture de pastèque et melon lors d'un événement",
      },
      {
        src: "/assets/galerie/cocktails-6.webp",
        alt: "Coupes de fruits frais du bar à jus Precious",
      },
      {
        src: "/assets/galerie/cocktails-1.webp",
        alt: "Fontaine de jus de gingembre et cocktails au kiwi",
      },
      {
        src: "/assets/galerie/cocktails-2.webp",
        alt: "Service Precious auprès des invités d'un événement",
        caption: "Nous servons, vous profitez",
      },
    ],
    formIntro:
      "Racontez-nous votre événement : nous vous proposons une carte et un devis.",
    fields: [
      { name: "date", label: "Date de l'événement", type: "date", half: true },
      {
        name: "invites",
        label: "Nombre d'invités",
        type: "number",
        placeholder: "50",
        half: true,
      },
      {
        name: "lieu",
        label: "Lieu ou quartier",
        type: "text",
        placeholder: "Montréal, Laval…",
      },
    ],
  },
];

export const formation: Formation = {
  badge: "Formation",
  format: "En ligne ou en présentiel · Montréal",
  title: "Apprenez le métier, pas seulement les recettes.",
  intro:
    "Precious transmet ce qu'elle pratique depuis des années : composer, présenter et servir des boissons naturelles qui font parler d'elles. Chaque module se termine par une mise en pratique, sur vos produits et vos contraintes.",
  modules: [
    {
      title: "Cocktails événementiels",
      detail:
        "Composer une carte sans alcool, doser, colorer, dresser un bar et assurer le service le jour J.",
    },
    {
      title: "Boissons naturelles",
      detail:
        "Extraction, équilibre des saveurs, conservation et formats : des jus qui tiennent en bouche et dans le temps.",
    },
    {
      title: "Donuts gourmands",
      detail:
        "Pâte, cuisson, glaçages et finitions, avec les alternatives plus légères qui font la signature Precious.",
    },
    {
      title: "Lancer votre activité",
      detail:
        "Coût de revient, prix de vente, matériel, hygiène et premiers clients : de quoi passer de la passion au commerce.",
    },
  ],
  practical: [
    "Groupes réduits, rythme adapté à votre niveau",
    "Supports PDF et recettes à conserver",
    "Attestation de participation",
    "Accompagnement après la formation",
  ],
  cta: "S'inscrire à la formation",
  url: "", // ← URL Payhip de la formation
};

export const ebook: Ebook = {
  badge: "Ebook",
  format: "Format numérique · Téléchargement immédiat",
  title: "Le guide Precious",
  intro:
    "Les bases, les associations et les tours de main de la maison, réunis dans un guide illustré à garder sous la main quand l'envie de créer arrive.",
  highlights: [
    "Recettes illustrées, étape par étape",
    "Les accords de saveurs qui fonctionnent",
    "Le matériel utile — et celui dont on peut se passer",
    "À lire sur téléphone, tablette ou ordinateur",
  ],
  cover: {
    kicker: "Le guide",
    title: "Precious",
    footer: "Boissons naturelles & créativité",
  },
  cta: "Payer l'ebook",
  url: "", // ← URL Payhip de l'ebook
};

/**
 * Section « Notre savoir-faire ».
 * Chaque carte renvoie vers l'univers correspondant plus bas dans la page,
 * onglet déjà sélectionné.
 */
export const savoirFaire: Array<{
  pillar: string;
  pillarDetail: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  /** Destination du lien : un univers de la section créations, ou l'académie. */
  target: ServiceId | "academie";
  /** Décalage vertical, comme sur la maquette. */
  offset: "low" | "high" | "mid";
}> = [
  {
    pillar: "Apprendre",
    pillarDetail: "Formation et guide (ebook)",
    title: "Préparation des boissons naturelles",
    description:
      "Devenez expert en mixologie naturelle et en entrepreneuriat avec nos formations immersives.",
    image: "/assets/savoir-formation.webp",
    alt: "Atelier de formation Precious autour d'un plan de travail garni de fruits",
    target: "academie",
    offset: "low",
  },
  {
    pillar: "Savourer",
    pillarDetail: "Jus et donuts sur commande et en magasin",
    title: "Préparation de donuts sains",
    description:
      "La santé et la gourmandise : des donuts généreux et bons pour le corps.",
    image: "/assets/savoir-donuts.webp",
    alt: "Deux personnes glaçant des donuts dans l'atelier Precious",
    target: "donuts",
    offset: "high",
  },
  {
    pillar: "Célébrer",
    pillarDetail: "Cocktails et service événementiel",
    title: "Préparation des cocktails de fruits",
    description:
      "La santé et le bien-être : des boissons saines, aux saveurs variées et surtout bonnes pour le corps.",
    image: "/assets/savoir-cocktails.webp",
    alt: "Équipe Precious préparant des cocktails de fruits",
    target: "evenements",
    offset: "mid",
  },
];

/**
 * Les trois chapitres de « La maison », présentés en carrousel.
 * Textes repris de la maquette « la_maison ».
 */
export const maison = [
  {
    id: "histoire",
    chapter: "Notre histoire",
    lead: "Une conviction simple : rassembler les gens autour d'expériences authentiques, conviviales et naturelles.",
    paragraphs: [
      "Animés par la passion du goût, du partage et du bien-être, nous avons commencé par imaginer des moments où boissons fraîches, créativité et rencontres se rejoignent pour créer des souvenirs.",
      "Au fil du temps, cette vision s'est structurée et a donné naissance à plusieurs univers complémentaires : le bar à jus et ses cocktails événementiels, Precious Jus et ses boissons 100 % naturelles, Precious Donuts et sa touche gourmande.",
      "Aujourd'hui, ces trois univers avancent ensemble avec la même ambition : des produits et des expériences sincères, accessibles et créatives.",
    ],
    image: "/assets/maison-portrait.webp",
    alt: "La fondatrice de Precious dans les locaux de la maison",
    imageStyle: "portrait" as const,
  },
  {
    id: "valeurs",
    chapter: "Nos valeurs",
    lead: "Notre travail repose sur des valeurs simples, mais essentielles.",
    paragraphs: [
      "Le naturel, d'abord, guide chacun de nos choix : des ingrédients authentiques, sélectionnés avec soin pour préserver leurs qualités et leurs saveurs.",
      "La santé et la fraîcheur sont au cœur de notre approche. Nous croyons qu'il est possible d'allier plaisir, équilibre et bien-être à travers des créations gourmandes et responsables.",
      "L'accessibilité nous tient à cœur : offrir des expériences de qualité, compréhensibles et ouvertes à tous. Et l'originalité nourrit notre créativité — nous cherchons constamment à réinventer les codes.",
    ],
    image: "/assets/maison-valeurs.webp",
    alt: "Fontaine de jus de gingembre et cocktails dressés pour une réception",
    imageStyle: "paysage" as const,
  },
  {
    id: "vision",
    chapter: "Vision & engagement",
    lead: "Devenir une référence dans l'art de créer des expériences naturelles et conviviales.",
    paragraphs: [
      "Là où plaisir, apprentissage et authenticité se rencontrent. Nous nous engageons à proposer des prestations responsables, à valoriser le savoir-faire artisanal et à transmettre notre passion par la formation.",
      "Chaque projet est une collaboration : une occasion de comprendre les besoins de nos clients et de concevoir une expérience sur mesure.",
      "Au-delà des produits et des services, notre ambition est simple : créer du lien, inspirer des habitudes plus saines et apporter une touche de fraîcheur et d'élégance à chaque événement comme au quotidien.",
    ],
    image: "/assets/galerie/cocktails-7.webp",
    alt: "Bar à jus Precious dressé pour un événement",
    imageStyle: "paysage" as const,
  },
];

/**
 * Témoignages.
 * ⚠️ PLACEHOLDERS — ces avis sont écrits pour donner le ton, ils ne
 * proviennent pas de clients identifiés. Ils doivent être remplacés par de
 * vrais témoignages, avec l'accord des personnes citées, avant que le site
 * ne serve à autre chose qu'une démonstration.
 */
export const testimonials = [
  {
    quote:
      "En plus d'être délicieux, ils ont respecté le thème de la soirée jusque dans les couleurs des verres. Ma fête organisée à la dernière minute est devenue un vrai événement.",
    author: "Chloé N.",
    role: "Anniversaire · Montréal",
  },
  {
    quote:
      "Nous avons fait appel à Precious pour le mariage de ma sœur. Le bar à jus n'a pas désempli de la soirée, et plusieurs invités ont demandé les coordonnées avant de partir.",
    author: "Arlette Mbarga",
    role: "Mariage · Laval",
  },
  {
    quote:
      "Le jus de gingembre est exactement celui que je cherchais depuis mon arrivée ici : franc, bien relevé, sans sucre inutile. J'en commande maintenant toutes les semaines.",
    author: "Serge Fotso",
    role: "Client fidèle",
  },
  {
    quote:
      "J'ai suivi la formation sur les cocktails naturels pour lancer mon service traiteur. Les explications étaient claires et surtout applicables dès le lendemain.",
    author: "Nadège Ekwalla",
    role: "Formation cocktails",
  },
];

/** Albums de la section Réalisations. Chaque album s'ouvre en plein écran. */
export const albums = [
  {
    id: "evenements",
    label: "Événements & cocktails",
    blurb: "Bars à jus, cartes sur mesure et mises en scène.",
    images: services[2]?.gallery ?? [],
  },
  {
    id: "jus",
    label: "Jus naturels",
    blurb: "La gamme pressée, du gingembre aux fruits rouges.",
    images: services[0]?.gallery ?? [],
  },
  {
    id: "donuts",
    label: "Donuts",
    blurb: "Boîtes assorties et créations gourmandes.",
    images: services[1]?.gallery ?? [],
  },
  {
    id: "formations",
    label: "Formations",
    // Visuels provisoires : en attendant les photos d'atelier, on montre des
    // réalisations issues des prestations événementielles.
    blurb: "Ateliers, gestes et transmission.",
    images: [
      {
        src: "/assets/galerie/cocktails-2.webp",
        alt: "Service Precious auprès des invités d'un événement",
      },
      {
        src: "/assets/galerie/cocktails-6.webp",
        alt: "Coupes de fruits frais préparées par Precious",
      },
      {
        src: "/assets/galerie/cocktails-1.webp",
        alt: "Fontaine de jus de gingembre et cocktails au kiwi",
      },
      {
        src: "/assets/galerie/cocktails-9.webp",
        alt: "Cocktails colorés alignés sur un présentoir",
      },
    ],
  },
];

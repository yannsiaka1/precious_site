import { eventFields } from "./forms";
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
    // Visuels produit composés au format 2:3, taillés pour l'emplacement.
    galleryLayout: "unique",
    gallery: [
      {
        src: "/assets/galerie/jus-gingembre.webp",
        alt: "Jus de gingembre Precious servi au verre, citron et gingembre frais",
        caption: "Jus de gingembre — notre signature",
      },
      {
        src: "/assets/galerie/jus-hibiscus.webp",
        alt: "Bouteille Precious Tango, jus de fleurs d'hibiscus et gingembre",
        caption: "Tango — hibiscus & gingembre",
      },
      {
        src: "/assets/galerie/jus-vert.webp",
        alt: "Bouteille Precious Détox, jus vert aux épinards, concombre et céleri",
        caption: "Détox — le jus vert",
      },
      {
        src: "/assets/galerie/jus-gingembre-classique.webp",
        alt: "Bouteille de jus de gingembre Precious au format classique",
        caption: "Format classique, 474 ml",
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
    // Mêmes questions que le formulaire de bas de page : une demande
    // d'événement doit être chiffrable quel que soit l'endroit d'où elle part.
    fields: [
      { name: "date", label: "Date de l'événement", type: "date", half: true },
      ...eventFields,
    ],
  },
];

/**
 * Les deux offres de formation.
 *
 * Le texte reprend les mots que les gens tapent réellement dans un moteur de
 * recherche — formation cocktails et mocktails, jus naturels, événementiel,
 * Montréal, en ligne, présentiel — sans jamais forcer la phrase : une
 * formulation lisible convertit mieux qu'une accumulation de mots-clés.
 */
export const formations: Formation[] = [
  {
    id: "presentiel",
    badge: "En présentiel",
    format: "Montréal · Groupes réduits",
    title: "Formation jus, cocktails & mocktails — en présentiel",
    intro:
      "Une formation immersive à Montréal, où l'on apprend en faisant. Vous repartez capable de créer des cocktails et des mocktails qui ne ressemblent à aucun autre, de monter un bar complet, de tenir une prestation du premier échange jusqu'au démontage — et de faire connaître votre travail une fois rentré chez vous.",
    programme: [
      "Créer des cocktails et des mocktails originaux : équilibre des saveurs, textures, couleurs, garnitures",
      "Composer une carte qui respecte le thème, les couleurs et l'ambiance demandés par un client",
      "Choisir et gérer son matériel : quantités, montage, entretien, transport",
      "Préparer et organiser une prestation événementielle, du devis au démontage",
      "Créer sa présence en ligne : photographier ses créations, publier, décrocher ses premiers clients",
      "Les secrets et les rouages du métier — ceux qui ne s'apprennent qu'auprès de quelqu'un qui les pratique",
    ],
    includes: [
      "La formation complète en présentiel, à Montréal",
      "Exercices pratiques et accompagnement en direct",
      "Le livre Precious inclus",
      "1 mois de suivi personnalisé après la formation",
      "1 stage pratique sur une vraie prestation avec l'équipe, selon les disponibilités",
    ],
    price: "2 000 $ CAD",
    priceNote:
      "Paiement unique. Inscription confirmée dès validation du paiement. Les stages pratiques sont proposés selon les prestations, événements et places disponibles.",
    cta: "S'inscrire à la formation présentielle — 2 000 $",
    url: "https://payhip.com/order?link=reUX6&pricing_plan=18B15gV2BZ",
  },
  {
    id: "en-ligne",
    badge: "En ligne",
    format: "À distance · Sessions en visioconférence",
    title: "Formation jus, cocktails & mocktails — en ligne",
    intro:
      "Le savoir-faire Precious, où que vous soyez. Même programme de création, même exigence : vous apprenez à composer, présenter et vendre des cocktails et des mocktails originaux, avec un accompagnement qui ne s'arrête pas à la fin de la session.",
    programme: [
      "Créer des cocktails et des mocktails originaux : équilibre des saveurs, textures, couleurs",
      "Composer une carte qui respecte le thème et les couleurs d'un événement",
      "Choisir et gérer son matériel : quantités, montage, entretien",
      "Préparer et organiser une prestation, du devis au jour J",
      "Créer sa présence en ligne et trouver ses premiers clients",
      "Les secrets et les rouages du métier, expliqués sans détour",
    ],
    includes: [
      "L'accès à la formation Precious en ligne",
      "Le livre Precious inclus",
      "1 mois de suivi personnalisé après la formation",
      "1 stage pratique sur une vraie prestation ou un événement, selon les disponibilités",
    ],
    price: "1 500 $ CAD",
    priceNote:
      "Paiement unique. Inscription confirmée dès validation du paiement. Les stages pratiques sont proposés selon les prestations, événements et places disponibles.",
    cta: "S'inscrire à la formation en ligne — 1 500 $",
    url: "https://payhip.com/order?link=X3taT&pricing_plan=V6B73gDJBr",
  },
];

/**
 * Déroulé de l'inscription, commun aux deux offres.
 *
 * Placé avant les offres : on sait comment les choses se passent avant de
 * regarder les prix, ce qui lève l'hésitation au moment de cliquer.
 */
export const inscription = [
  "Vous complétez vos informations et réglez le paiement sécurisé.",
  "Votre inscription est confirmée immédiatement après validation du paiement.",
  "Vous ouvrez votre espace participant — par le lien affiché après le paiement ou par le courriel reçu — en vous connectant avec l'adresse et le mot de passe choisis au moment du paiement.",
  "L'équipe Precious vous écrit sous 24 heures : date, horaire, lieu exact ou lien de visioconférence, et toutes les informations pratiques.",
];

export const ebook: Ebook = {
  badge: "Ebook",
  format: "Format numérique · Téléchargement immédiat",
  title: "Le guide Precious",
  intro:
    "Le livre que reçoivent nos participants, disponible seul. On y trouve la méthode de la maison : comment une recette se construit, pourquoi certaines associations fonctionnent et d'autres non, et les gestes qui font la différence entre une boisson correcte et une boisson dont on se souvient.",
  highlights: [
    "Des recettes de jus, de cocktails et de mocktails, expliquées étape par étape",
    "La logique des accords de saveurs : sucre, acidité, amertume, épices",
    "Composer une carte cohérente autour d'un thème et de ses couleurs",
    "Dresser, garnir et photographier ses créations pour qu'elles donnent envie",
    "Le matériel vraiment utile — et celui dont on peut se passer au début",
    "Conservation, quantités et préparation à l'avance",
  ],
  cover: {
    kicker: "Le guide",
    title: "Precious",
    footer: "Boissons naturelles & créativité",
  },
  cta: "Payer l'ebook",
  url: "", // ← lien Payhip du guide, une fois le produit en ligne
};

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
      "Devenez expert en preparation de cocktails et moktails et en entrepreneuriat avec nos formations immersives.",
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
    pillarDetail: "Cocktails, moktails et service événementiel",
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
    alt: "Coupes de cocktail mangue et fruits rouges dressées par Precious",
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

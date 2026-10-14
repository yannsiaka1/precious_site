import { eventFields } from "./forms";
import type { Ebook, Formation, Question, Service, ServiceId } from "./types";

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
      {
        src: "/assets/galerie/cocktails-16.webp",
        alt: "Bar à jus Precious dressé pour un événement : mocktails alignés, fontaines de jus de gingembre et de fleurs d'hibiscus",
        caption: "Le bar monté chez vous",
      },
      {
        src: "/assets/galerie/cocktails-10.webp",
        alt: "Flûtes de mocktail orange et violet garnies d'orange et d'aneth, dressées en pyramide",
      },
      {
        src: "/assets/galerie/cocktails-11.webp",
        alt: "Pyramide de mocktails bicolores sur présentoir, décor floral blanc et orange",
      },
      {
        src: "/assets/galerie/cocktails-12.webp",
        alt: "Coupes de mocktail à l'ananas et flûtes bicolores, décor d'automne",
      },
      {
        src: "/assets/galerie/cocktails-13.webp",
        alt: "Coupes de mocktail crémeux à l'ananas, garnies d'une feuille de pandan",
      },
      {
        src: "/assets/galerie/cocktails-14.webp",
        alt: "Verres de mocktail doré coiffés de mousse et de citron séché, à côté de mocktails rouges",
      },
      {
        src: "/assets/galerie/cocktails-15.webp",
        alt: "Présentoir de mocktails dorés et rouges, décor floral blanc et orange",
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
    duree: "Une journée de 8 h, de 9 h à 17 h",
    title: "Formation jus, cocktails & mocktails — en présentiel",
    intro:
      "Une formation immersive à Montréal, où l'on apprend en faisant. Vous repartez capable de créer des cocktails et des mocktails qui ne ressemblent à aucun autre, de monter un bar complet, de tenir une prestation du premier échange jusqu'au démontage — et de faire connaître votre travail une fois rentré chez vous.",
    programme: [
      "Préparer les boissons de A à Z : choix des ingrédients, composition, dosage, conservation et stockage",
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
      "1 stage pratique sur un événement officiel de Precious, selon les disponibilités",
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
    duree: "3 séances de 2 h 30, en visioconférence",
    title: "Formation jus, cocktails & mocktails — en ligne",
    intro:
      "Le savoir-faire Precious, où que vous soyez. Même programme de création, même exigence : vous apprenez à composer, présenter et vendre des cocktails et des mocktails originaux, avec un accompagnement qui ne s'arrête pas à la fin de la session.",
    programme: [
      "Préparer les boissons de A à Z : choix des ingrédients, composition, dosage, conservation et stockage",
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
      "1 stage pratique sur un événement officiel de Precious, selon les disponibilités",
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
  // Le guide existe, mais il n'est pas vendu séparément : il est remis aux
  // personnes inscrites à l'une des deux formations. Le texte le dit
  // franchement plutôt que de laisser croire à une vente en ligne, ce qui
  // vaut mieux qu'un visiteur qui cherche un bouton d'achat et n'en trouve
  // pas.
  format: "Format numérique · Remis aux personnes inscrites",
  title: "Le guide Precious",
  intro:
    "Le livre que reçoivent nos participants. On y trouve la méthode de la maison : comment une recette se construit, pourquoi certaines associations fonctionnent et d'autres non, et les gestes qui font la différence entre une boisson correcte et une boisson dont on se souvient.",
  /** Précision affichée à la place d'un prix, tant que le guide n'est pas vendu seul. */
  disponibilite:
    "Il est inclus dans les deux formations, en présentiel comme en ligne, et n'est pas vendu séparément pour le moment.",
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
      "Devenez expert en préparation de cocktails et mocktails, et en entrepreneuriat, grâce à nos formations immersives.",
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
    pillarDetail: "Cocktails, mocktails et service événementiel",
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
 *
 * Avis authentiques, recueillis sur la page Facebook de Precious. Seule la
 * typographie a été reprise — apostrophes, accents, ponctuation. Les mots
 * sont ceux des personnes qui les ont écrits.
 *
 * Les particuliers sont identifiés par leur prénom et l'initiale de leur nom :
 * un commentaire public sur un réseau social n'équivaut pas à une
 * autorisation de figurer sur un site commercial. Les organismes sont nommés
 * en entier, puisqu'ils s'expriment au nom de leur structure.
 */
export const testimonials = [
  {
    quote: "C'était vraiment bon. Du jus 100 % naturel. Bravo.",
    author: "Reine F.",
    role: "Avis Facebook",
  },
  {
    quote:
      "Un très beau travail. Le goût et la quantité étaient au rendez-vous. Bravo.",
    author: "Fatou D.",
    role: "Avis Facebook",
  },
  {
    quote:
      "Avec Precious 100 % bio, votre événement prend une image extraordinaire.",
    author: "Joël Z.",
    role: "Avis Facebook",
  },
  {
    quote:
      "Merci pour votre professionnalisme. Hâte à la prochaine collaboration.",
    author: "Réseau des Femmes en Action",
    role: "Organisme partenaire",
  },
  {
    quote: "Merci infiniment pour l'excellent service.",
    author: "BAI — Bienvenue à l'immigrant",
    role: "Organisme partenaire",
  },
  {
    quote:
      "Ce fut un grand plaisir de collaborer avec toi, tu es vraiment professionnelle ! Et la qualité des produits est extraordinaire.",
    author: "Anastasie N.",
    role: "Avis Facebook",
  },
  {
    quote: "Des jus santé et goûteux.",
    author: "Edith M.",
    role: "Avis Facebook",
  },
  {
    quote: "Une cliente très satisfaite. Merci beaucoup !",
    author: "Christmène B.",
    role: "Avis Facebook",
  },
];

/**
 * Questions fréquentes sur les formations.
 *
 * Elles répondent aux objections réelles d'une personne sur le point de
 * verser 1 500 ou 2 000 $ : durée, contenu, déroulé du stage, suivi. Réponses
 * volontairement courtes — elles s'affichent en accordéon dans la colonne de
 * droite, sous le guide.
 */
export const questionsFormation: Question[] = [
  {
    question: "Combien de temps dure la formation ?",
    reponse:
      "En présentiel : une journée complète de 8 heures, de 9 h à 17 h. En ligne : trois séances de 2 h 30 en visioconférence. Les dates sont fixées avec le formateur.",
  },
  {
    question:
      "Apprend-on aussi à préparer les jus, ou seulement les cocktails ?",
    reponse:
      "Les deux. La préparation des boissons est enseignée de bout en bout : choix des ingrédients, composition, dosage, conservation et stockage.",
  },
  {
    question: "En quoi consiste le stage pratique ?",
    reponse:
      "Une participation à un événement officiel de Precious. Vous suivez toute la chaîne : préparation, logistique, mise en place, service — et la façon dont la facturation s'établit selon la taille de l'événement.",
  },
  {
    question: "Quand ont lieu les séances ?",
    reponse:
      "Le formateur vous écrit sous 24 heures après l'inscription pour fixer la date, l'horaire et le lieu — ou votre lien de visioconférence.",
  },
  {
    question: "Que comprend le mois de suivi ?",
    reponse:
      "Un accompagnement par courriel, sans limite de questions, pendant le mois qui suit la formation.",
  },
  {
    question: "Comment se passe le paiement ?",
    reponse:
      "Paiement unique et sécurisé. Votre inscription est confirmée dès la validation, et vous ouvrez aussitôt votre espace participant.",
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
    id: "bouchees",
    label: "Bouchées & apéritifs",
    blurb: "Mini-burgers, sandwichs, croissants et douceurs à partager.",
    images: [
      {
        src: "/assets/galerie/bouchees-1.webp",
        alt: "Plateau de mini-burgers garnis, piqués de radis sur brochette",
        caption: "Mini-burgers garnis",
      },
      {
        src: "/assets/galerie/bouchees-2.webp",
        alt: "Plateau de mini-croissants jambon-fromage et brochettes de tomates cerises",
      },
      {
        src: "/assets/galerie/bouchees-3.webp",
        alt: "Table d'apéritif Precious : croissants, mini-burgers et cupcakes aux fraises",
        caption: "Table d'apéritif dressée",
      },
      {
        src: "/assets/galerie/bouchees-4.webp",
        alt: "Mini-sandwichs club au thon et aux œufs, brochettes de tomates cerises",
      },
      {
        src: "/assets/galerie/bouchees-5.webp",
        alt: "Coupe de fromages, noix, amandes et fraises fraîches",
        caption: "Plateau de fromages et fruits",
      },
    ],
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

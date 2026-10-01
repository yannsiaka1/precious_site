import type { RequestField } from "./types";

/**
 * Sujet du formulaire de contact qui déclenche les questions événementielles.
 * Doit correspondre exactement au titre du service dans `offerings.ts`.
 */
export const EVENT_SUBJECT = "Cocktails & événements";

/**
 * Questions posées en plus lorsque la demande concerne un événement.
 *
 * Elles reprennent le formulaire de commande utilisé jusqu'ici par Precious,
 * afin qu'une demande reçue par le site contienne les mêmes informations :
 * un devis doit pouvoir être établi sans relance.
 */
export const eventFields: RequestField[] = [
  {
    name: "typeEvenement",
    label: "Type d'événement",
    type: "select",
    half: true,
    options: [
      "Mariage",
      "Anniversaire",
      "Baptême ou dot",
      "Événement d'entreprise",
      "Gala",
      "Baby shower",
      "Remise de diplôme",
      "Festival ou marché",
      "Autre célébration",
    ],
    // « Autre célébration » n'apprend rien : on demande alors de nommer
    // l'occasion, faute de quoi il faut rappeler le client pour la connaître.
    reveal: {
      when: "Autre célébration",
      field: {
        name: "autreEvenement",
        label: "Précisez la nature de l'événement",
        type: "text",
        half: true,
        placeholder: "Soirée d'entreprise, retrouvailles…",
      },
    },
  },
  {
    name: "theme",
    label: "Thème ou ambiance",
    type: "text",
    half: true,
    placeholder: "Couleurs, style, inspiration…",
  },
  {
    name: "invites",
    label: "Nombre de personnes",
    type: "number",
    half: true,
    placeholder: "50",
  },
  {
    name: "heureDepart",
    label: "Heure de début du service",
    type: "time",
    half: true,
  },
  {
    name: "duree",
    label: "Durée de l'événement",
    type: "text",
    half: true,
    placeholder: "3 h, toute la soirée…",
  },
  {
    name: "lieu",
    label: "Adresse où l'événement aura lieu",
    type: "text",
    half: true,
    placeholder: "Salle, numéro et rue, ville",
  },
  {
    name: "facturation",
    label: "Adresse de facturation",
    type: "text",
    placeholder: "Si différente de l'adresse de l'événement",
    required: false,
  },
  {
    name: "saveurs",
    label: "Ce qui vous ferait plaisir",
    type: "checkboxes",
    hint: "Cochez tout ce qui vous intéresse — la carte se compose ensuite avec vous.",
    required: false,
    options: [
      "Cocktail de fruits personnalisé",
      "Jus de gingembre",
      "Jus de fleurs d'hibiscus",
      "Verrines de fruits",
      "Bouchées de donuts",
      "Bouchées apéritives (mini-burgers, mini-sandwichs, plateaux d'apéro, cupcakes, croissants jambon-fromage…)",
    ],
  },
];

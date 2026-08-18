import type { RequestField } from "./types";

/**
 * Sujet du formulaire de contact qui déclenche les questions événementielles.
 * Doit correspondre exactement au titre du service dans `offerings.ts`.
 */
export const EVENT_SUBJECT = "Cocktails & événements";

/**
 * Questions posées en plus lorsque la demande concerne un événement.
 *
 * Elles servent à établir un devis dès le premier échange : sans le nombre
 * d'invités, le lieu et l'heure, il faut relancer le client avant de pouvoir
 * chiffrer quoi que ce soit.
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
      "Remise de diplôme",
      "Festival ou marché",
      "Autre célébration",
    ],
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
    label: "Durée souhaitée",
    type: "text",
    half: true,
    placeholder: "3 h, toute la soirée…",
  },
  {
    name: "lieu",
    label: "Lieu de l'événement",
    type: "text",
    half: true,
    placeholder: "Salle, adresse ou quartier",
  },
];

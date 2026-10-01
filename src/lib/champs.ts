import type { RequestField } from "@/content/types";

/**
 * Relève la valeur d'un champ dans un formulaire envoyé.
 *
 * Trois cas à distinguer :
 *  - les cases à cocher partagent un même `name` et produisent donc plusieurs
 *    entrées, qu'on réunit en une seule ligne lisible ;
 *  - un champ de précision ne s'affiche que selon un choix, et n'existe pas
 *    toujours dans l'envoi ;
 *  - les autres champs se lisent directement.
 */
export function releverDetails(
  champs: RequestField[],
  data: FormData,
  ignorer: string[] = [],
): Record<string, string> {
  const details: Record<string, string> = {};

  for (const champ of champs) {
    if (ignorer.includes(champ.name)) continue;

    if (champ.type === "checkboxes") {
      const coches = data.getAll(champ.name).map(String).filter(Boolean);
      if (coches.length) details[champ.label] = coches.join(" · ");
      continue;
    }

    details[champ.label] = String(data.get(champ.name) ?? "");

    // Le champ révélé par un choix n'est présent que s'il a été affiché.
    if (champ.reveal) {
      const precision = String(data.get(champ.reveal.field.name) ?? "");
      if (precision) details[champ.reveal.field.label] = precision;
    }
  }

  return details;
}

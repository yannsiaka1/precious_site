import { useId } from "react";
import type { RequestField } from "@/content/types";
import { fieldClass, labelClass } from "./formStyles";
import { cn } from "@/lib/cn";

/**
 * Rend un champ décrit dans `content/`.
 *
 * Un seul endroit décide de l'apparence, des attributs de saisie et des
 * bornes : ajouter une question à un formulaire ne demande plus que d'écrire
 * une ligne de données.
 */
export function Field({ field }: { field: RequestField }) {
  const id = useId();
  const required = field.required !== false;

  /** Aides de saisie propres à chaque type, surtout utiles sur téléphone. */
  const inputMode =
    field.type === "number"
      ? "numeric"
      : field.type === "tel"
        ? "tel"
        : undefined;

  return (
    <label
      htmlFor={id}
      className={cn(labelClass, !field.half && "sm:col-span-2")}
    >
      {field.label}

      {field.type === "select" ? (
        <select
          id={id}
          name={field.name}
          required={required}
          className={fieldClass}
        >
          <option value="">Choisir…</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type}
          required={required}
          placeholder={field.placeholder}
          inputMode={inputMode}
          min={field.type === "number" ? 1 : undefined}
          max={field.type === "number" ? 5000 : undefined}
          maxLength={field.type === "text" ? 120 : undefined}
          className={fieldClass}
        />
      )}
    </label>
  );
}

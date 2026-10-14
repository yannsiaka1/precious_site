import { useId, useState } from "react";
import type { RequestField } from "@/content/types";
import { fieldClass, labelClass } from "./formStyles";
import { cn } from "@/lib/cn";

/**
 * Rend un champ décrit dans `content/`.
 *
 * Un seul endroit décide de l'apparence, des attributs de saisie et des
 * bornes : ajouter une question à un formulaire ne demande plus que d'écrire
 * une ligne de données.
 *
 * Trois formes sont gérées : la saisie simple, la liste déroulante — qui peut
 * faire apparaître un champ de précision selon le choix — et le groupe de
 * cases à cocher.
 */
export function Field({ field }: { field: RequestField }) {
  const id = useId();
  const required = field.required !== false;

  /** Valeur de la liste, pour savoir s'il faut révéler le champ lié. */
  const [choix, setChoix] = useState("");
  const revele = field.reveal && choix === field.reveal.when;

  /** Aides de saisie propres à chaque type, surtout utiles sur téléphone. */
  const inputMode =
    field.type === "number"
      ? "numeric"
      : field.type === "tel"
        ? "tel"
        : undefined;

  /**
   * Les champs numériques n'acceptent que des entiers.
   *
   * Un nombre d'invités ou de pièces ne se compte pas en décimales. Trois
   * garde-fous se complètent, parce qu'aucun ne suffit seul :
   *
   *   - `step={1}` cadre la validation du navigateur et les flèches haut/bas ;
   *   - `onBeforeInput` bloque la frappe du séparateur décimal et du signe,
   *     que `step` laisserait saisir avant de signaler l'erreur ;
   *   - `onKeyDown` neutralise « e » et « E » (notation scientifique), que
   *     `<input type="number">` accepte sans les transmettre à `onBeforeInput`.
   *
   * La touche est simplement ignorée : rien n'est réécrit dans le champ, donc
   * le curseur ne saute pas et le collage reste possible — la validation du
   * navigateur prendra le relais si la valeur collée n'est pas entière.
   */
  const estNombre = field.type === "number";

  const filtrerSaisie = (event: React.FormEvent<HTMLInputElement>) => {
    const saisi = (event as unknown as { data: string | null }).data;
    if (saisi && /[^0-9]/.test(saisi)) event.preventDefault();
  };

  const filtrerTouche = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", ".", ","].includes(event.key)) event.preventDefault();
  };

  // ------------------------------------------------------------------
  // Cases à cocher : un groupe, pas un champ unique. On utilise donc un
  // <fieldset> avec sa légende, ce que les lecteurs d'écran annoncent
  // correctement, plutôt qu'un <label> qui ne porterait que sur une case.
  // ------------------------------------------------------------------
  if (field.type === "checkboxes") {
    return (
      <fieldset className="sm:col-span-2">
        <legend className={cn(labelClass, "mb-0 p-0")}>{field.label}</legend>
        {field.hint ? (
          <p className="mt-1 text-sm text-ink/70">{field.hint}</p>
        ) : null}

        <div className="mt-3 grid gap-1">
          {field.options?.map((option) => (
            // La zone cliquable couvre toute la ligne et dépasse 44 px de
            // haut : au doigt, on vise le texte autant que la case.
            <label
              key={option}
              className="flex min-h-11 cursor-pointer items-center gap-3 py-1 text-[0.98rem] text-ink/85"
            >
              <input
                type="checkbox"
                name={field.name}
                value={option}
                className="size-5 shrink-0 accent-forest"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <>
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
            value={choix}
            onChange={(event) => setChoix(event.target.value)}
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
            min={estNombre ? 1 : undefined}
            max={estNombre ? 5000 : undefined}
            step={estNombre ? 1 : undefined}
            onBeforeInput={estNombre ? filtrerSaisie : undefined}
            onKeyDown={estNombre ? filtrerTouche : undefined}
            maxLength={field.type === "text" ? 120 : undefined}
            className={fieldClass}
          />
        )}
      </label>

      {/* Champ de précision, affiché uniquement quand le choix l'appelle. */}
      {revele && field.reveal ? (
        <div className="animate-[panel_380ms_var(--ease-out-soft)_both] contents">
          <Field field={field.reveal.field} />
        </div>
      ) : null}
    </>
  );
}

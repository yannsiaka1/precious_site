/**
 * Apparence commune aux champs de formulaire.
 * Les quatre formulaires du site (trois commandes + contact) partagent cette
 * base : une seule ligne à changer pour les faire évoluer ensemble.
 */
export const fieldClass = [
  "w-full rounded-lg border border-ink/15 bg-paper/70 px-4 py-3",
  "text-[1.02rem] text-ink outline-none placeholder:text-ink/30",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "hover:border-ink/30",
  "focus:border-forest focus:bg-paper focus:shadow-[0_0_0_3px_rgba(13,84,41,0.12)]",
  // Le rouge n'apparaît qu'après une tentative d'envoi ou une sortie de champ,
  // jamais pendant la frappe.
  "user-invalid:border-[#c0392b] user-invalid:shadow-[0_0_0_3px_rgba(192,57,43,0.12)]",
].join(" ");

export const labelClass =
  "grid gap-2 font-ui text-[0.7rem] font-bold tracking-[0.14em] text-ink/55 uppercase";

/** Contraintes de saisie communes, pour ne recevoir que des données propres. */
export const limits = {
  name: { maxLength: 80, minLength: 2, pattern: "[^<>{}]{2,80}" },
  email: { maxLength: 120 },
  phone: { maxLength: 25, pattern: "[0-9+()\\s.-]{7,25}" },
  text: { maxLength: 120 },
  message: { maxLength: 1500 },
} as const;

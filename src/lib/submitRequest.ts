import { site } from "@/content/site";

export interface RequestPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  message: string;
  /** Champs propres à un service (quantité, nombre d'invités…). */
  details?: Record<string, string>;
}

/**
 * Point d'envoi du formulaire, défini dans un fichier `.env` :
 *   VITE_CONTACT_ENDPOINT=https://…
 * Tant qu'il est vide, on bascule sur le client de messagerie du visiteur.
 */
const ENDPOINT = import.meta.env["VITE_CONTACT_ENDPOINT"] ?? "";

export type SubmitOutcome = "sent" | "handoff";

/**
 * Retire les caractères de contrôle et les chevrons, et borne la longueur.
 * Le navigateur valide déjà les champs, mais rien n'empêche de forger une
 * requête : on ne fait jamais confiance à ce qui sort du formulaire.
 */
export function clean(value: string, max = 1500): string {
  return (
    value
      // eslint-disable-next-line no-control-regex -- on retire justement les caractères de contrôle
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, max)
  );
}

function buildMailto(payload: RequestPayload): string {
  const subject = `Demande Precious — ${clean(payload.subject, 80)}`;
  const body = [
    `Nom : ${clean(payload.name, 80)}`,
    `Courriel : ${clean(payload.email, 120)}`,
    payload.phone && `Téléphone : ${clean(payload.phone, 25)}`,
    payload.date && `Date souhaitée : ${clean(payload.date, 10)}`,
    `Besoin : ${clean(payload.subject, 80)}`,
    ...Object.entries(payload.details ?? {}).map(
      ([label, value]) => value && `${clean(label, 40)} : ${clean(value, 120)}`,
    ),
    "",
    clean(payload.message),
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Envoie la demande.
 * - `sent` : reçue par le serveur, plus rien à faire pour le visiteur.
 * - `handoff` : le client de messagerie a été ouvert, l'envoi reste à confirmer.
 */
export async function submitRequest(
  payload: RequestPayload,
): Promise<SubmitOutcome> {
  if (!ENDPOINT) {
    window.location.href = buildMailto(payload);
    return "handoff";
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: clean(payload.name, 80),
      email: clean(payload.email, 120),
      phone: clean(payload.phone, 25),
      subject: clean(payload.subject, 80),
      date: clean(payload.date, 10),
      message: clean(payload.message),
      details: Object.fromEntries(
        Object.entries(payload.details ?? {}).map(([label, value]) => [
          clean(label, 40),
          clean(value, 120),
        ]),
      ),
    }),
  });

  if (!response.ok) {
    throw new Error(`Envoi refusé (${response.status})`);
  }

  return "sent";
}

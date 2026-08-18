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

function buildMailto(payload: RequestPayload): string {
  const subject = `Demande Precious — ${payload.subject}`;
  const body = [
    `Nom : ${payload.name}`,
    `Courriel : ${payload.email}`,
    payload.phone && `Téléphone : ${payload.phone}`,
    payload.date && `Date souhaitée : ${payload.date}`,
    `Besoin : ${payload.subject}`,
    ...Object.entries(payload.details ?? {}).map(
      ([label, value]) => value && `${label} : ${value}`,
    ),
    "",
    payload.message,
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
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Envoi refusé (${response.status})`);
  }

  return "sent";
}

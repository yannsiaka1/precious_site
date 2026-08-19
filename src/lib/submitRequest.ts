import { useRef } from "react";
import { site } from "@/content/site";

export interface RequestPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  message: string;
  /** Champs propres à un service ou à un type de demande. */
  details?: Record<string, string>;
  /** Horodatage d'ouverture du formulaire, fourni par `useFormStart`. */
  startedAt?: number;
  /** Valeur du champ piège. Vide chez un humain, remplie par un automate. */
  website?: string;
}

/**
 * Point d'envoi. Par défaut la fonction serverless du site, sur le même
 * domaine — l'adresse de destination et la clé du service d'envoi restent
 * donc côté serveur, jamais dans le JavaScript envoyé au navigateur.
 *
 * `VITE_CONTACT_ENDPOINT` permet de pointer ailleurs (Formspree, n8n, une API
 * maison) sans toucher au code.
 */
const ENDPOINT = import.meta.env["VITE_CONTACT_ENDPOINT"] || "/api/contact";

export type SubmitOutcome = "sent" | "handoff";

/**
 * Retire les caractères de contrôle et les chevrons, et borne la longueur.
 * Le navigateur valide déjà les champs et le serveur revalide tout : ce
 * nettoyage évite simplement d'envoyer n'importe quoi sur le réseau.
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

/** Prépare une charge utile propre, commune aux deux voies d'envoi. */
function normalise(payload: RequestPayload) {
  return {
    name: clean(payload.name, 80),
    email: clean(payload.email, 120),
    phone: clean(payload.phone, 25),
    subject: clean(payload.subject, 80),
    date: clean(payload.date, 10),
    message: clean(payload.message),
    details: Object.fromEntries(
      Object.entries(payload.details ?? {})
        .filter(([, value]) => value)
        .map(([label, value]) => [clean(label, 40), clean(value, 160)]),
    ),
    /*
     * Durée de remplissage, calculée ici et non sur le serveur : les deux
     * horloges n'ont aucune raison d'être synchronisées, et un écart de
     * quelques secondes suffirait à rejeter une saisie parfaitement normale.
     */
    elapsedMs: payload.startedAt ? Date.now() - payload.startedAt : 0,
    website: payload.website ?? "",
  };
}

/** Repli : ouvre la messagerie du visiteur avec la demande pré-remplie. */
function openMailClient(payload: ReturnType<typeof normalise>) {
  const body = [
    `Nom : ${payload.name}`,
    `Courriel : ${payload.email}`,
    payload.phone && `Téléphone : ${payload.phone}`,
    payload.date && `Date souhaitée : ${payload.date}`,
    `Besoin : ${payload.subject}`,
    ...Object.entries(payload.details).map(
      ([label, value]) => `${label} : ${value}`,
    ),
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  window.location.href =
    `mailto:${site.contact.email}` +
    `?subject=${encodeURIComponent(`Demande Precious — ${payload.subject}`)}` +
    `&body=${encodeURIComponent(body)}`;
}

/**
 * Envoie la demande.
 *
 * - `sent` : le serveur a accepté et expédié le courriel, plus rien à faire.
 * - `handoff` : aucun service d'envoi n'est configuré, on a ouvert la
 *   messagerie du visiteur ; l'envoi reste à confirmer de sa main.
 *
 * Toute autre erreur est relancée pour que le formulaire l'affiche.
 */
export async function submitRequest(
  payload: RequestPayload,
): Promise<SubmitOutcome> {
  const body = normalise(payload);

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Hors ligne ou serveur injoignable : on ne perd pas la saisie.
    openMailClient(body);
    return "handoff";
  }

  // 404 en développement local (la fonction n'est servie que par Vercel),
  // 501 tant que la clé du service d'envoi n'est pas renseignée.
  if (response.status === 404 || response.status === 501) {
    openMailClient(body);
    return "handoff";
  }

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(
      detail?.error ??
        (response.status === 429
          ? "Trop de demandes envoyées coup sur coup. Réessayez dans un instant."
          : "L'envoi n'a pas abouti."),
    );
  }

  return "sent";
}

/**
 * Horodate l'ouverture du formulaire.
 * Le serveur refuse les envois trop rapides : un humain met plusieurs
 * secondes à remplir un formulaire, un robot non.
 */
export function useFormStart(): number {
  const startedAt = useRef(Date.now());
  return startedAt.current;
}

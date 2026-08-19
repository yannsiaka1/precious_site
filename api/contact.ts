/**
 * Fonction serverless de réception des formulaires.
 *
 * Elle tourne sur Vercel, à l'adresse /api/contact, sur le même domaine que le
 * site. Le navigateur ne connaît donc ni l'adresse de destination ni la clé du
 * service d'envoi : les deux vivent dans les variables d'environnement Vercel.
 *
 * Variables attendues :
 *   RESEND_API_KEY  clé du compte Resend (obligatoire)
 *   CONTACT_TO      adresse qui reçoit les demandes
 *   CONTACT_FROM    expéditeur, ex. "Precious <site@votredomaine.com>"
 *
 * Sans RESEND_API_KEY, la fonction répond 501 et le site bascule sur la
 * messagerie du visiteur : aucune demande n'est perdue.
 */

export const config = { runtime: "edge" };

/** Charge utile attendue du formulaire. */
interface Payload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  message: string;
  details: Record<string, string>;
}

/** Bornes de longueur, identiques à celles annoncées au navigateur. */
const LIMITS: Record<string, number> = {
  name: 80,
  email: 120,
  phone: 25,
  subject: 80,
  date: 10,
  message: 1500,
};

/**
 * Délai minimal de remplissage, mesuré par le navigateur puis transmis.
 * En deçà, la saisie n'a pas pu être humaine.
 */
const MIN_FILL_MS = 1500;
/** Au-delà, la page est restée ouverte si longtemps qu'on préfère la recharger. */
const MAX_FILL_MS = 12 * 60 * 60 * 1000;

/**
 * Nombre d'envois tolérés par adresse IP sur la fenêtre.
 *
 * Volontairement large : les opérateurs mobiles partagent une même adresse IP
 * entre des milliers d'abonnés. Une limite serrée bloquerait de vrais clients.
 */
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Compteur d'envois par IP.
 *
 * En mémoire, donc propre à chaque instance : c'est une gêne pour un envoi
 * répété, pas une garantie. Une vraie limite demanderait un stockage partagé
 * (Vercel KV, Upstash). Suffisant tant que le site reçoit quelques demandes
 * par jour.
 */
const hits = new Map<string, number[]>();

/**
 * Enregistre une tentative et indique si le quota est dépassé.
 *
 * Appelé seulement une fois la demande validée : une erreur de saisie ne doit
 * pas consommer le quota de la personne qui corrige et renvoie.
 */
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

/** Nettoie une valeur : caractères de contrôle, chevrons, longueur. */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return (
    value
      // eslint-disable-next-line no-control-regex -- on retire justement les caractères de contrôle
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, max)
  );
}

/** Contrôle de forme d'une adresse courriel. */
function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Échappe le texte inséré dans le corps HTML du courriel. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    // Le site retombera sur la messagerie du visiteur.
    return json({ error: "Service d'envoi non configuré." }, 501);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Requête illisible." }, 400);
  }

  // Piège à robots : ce champ est invisible dans le formulaire.
  if (clean(raw["website"], 10)) {
    // On répond comme si tout allait bien : inutile d'informer l'automate.
    return json({ ok: true }, 200);
  }

  /*
   * Durée de remplissage mesurée par le navigateur puis transmise.
   * On ne compare jamais l'heure du client à celle du serveur : rien ne
   * garantit qu'elles soient synchronisées, et quelques secondes d'écart
   * suffiraient à rejeter une saisie parfaitement normale.
   */
  const elapsed = Number(raw["elapsedMs"]) || 0;
  if (elapsed < MIN_FILL_MS) {
    return json(
      { error: "Envoi trop rapide. Réessayez dans un instant." },
      400,
    );
  }
  if (elapsed > MAX_FILL_MS) {
    return json(
      {
        error:
          "La page est ouverte depuis longtemps. Rechargez-la puis réessayez.",
      },
      400,
    );
  }

  const payload: Payload = {
    name: clean(raw["name"], LIMITS["name"]!),
    email: clean(raw["email"], LIMITS["email"]!),
    phone: clean(raw["phone"], LIMITS["phone"]!),
    subject: clean(raw["subject"], LIMITS["subject"]!) || "Demande",
    date: clean(raw["date"], LIMITS["date"]!),
    message: clean(raw["message"], LIMITS["message"]!),
    details: {},
  };

  const details = raw["details"];
  if (details && typeof details === "object") {
    for (const [label, value] of Object.entries(
      details as Record<string, unknown>,
    )) {
      const key = clean(label, 40);
      const text = clean(value, 160);
      if (key && text) payload.details[key] = text;
    }
  }

  if (payload.name.length < 2) {
    return json({ error: "Merci d'indiquer votre nom." }, 400);
  }
  if (!validEmail(payload.email)) {
    return json({ error: "L'adresse courriel semble incorrecte." }, 400);
  }
  if (payload.message.length < 5) {
    return json({ error: "Merci de préciser votre demande." }, 400);
  }

  // Quota compté ici seulement : la demande est complète et valide, c'est un
  // vrai envoi.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  if (rateLimited(ip)) {
    return json(
      {
        error:
          "Trop de demandes envoyées coup sur coup. Réessayez dans quelques minutes.",
      },
      429,
    );
  }

  const lines: Array<[string, string]> = [
    ["Nom", payload.name],
    ["Courriel", payload.email],
    ["Téléphone", payload.phone],
    ["Date souhaitée", payload.date],
    ["Nature de la demande", payload.subject],
    ...Object.entries(payload.details),
  ].filter(([, value]) => value) as Array<[string, string]>;

  const text = [
    ...lines.map(([label, value]) => `${label} : ${value}`),
    "",
    "Message :",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#17321f;line-height:1.55">
      <h2 style="margin:0 0 4px;font-size:18px">Nouvelle demande — ${escapeHtml(payload.subject)}</h2>
      <p style="margin:0 0 18px;color:#5d6b60;font-size:13px">Envoyée depuis le site Precious</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
        ${lines
          .map(
            ([label, value]) => `<tr>
              <td style="padding:6px 18px 6px 0;color:#5d6b60;white-space:nowrap">${escapeHtml(label)}</td>
              <td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:22px 0 6px;color:#5d6b60;font-size:13px">Message</p>
      <p style="margin:0;padding:14px 16px;background:#f7f2e7;border-radius:8px;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>`;

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env["CONTACT_FROM"] ?? "Precious <onboarding@resend.dev>",
        to: [process.env["CONTACT_TO"] ?? "Preciousck384@gmail.com"],
        // Répondre au courriel répond directement au client.
        reply_to: payload.email,
        subject: `Precious — ${payload.subject} — ${payload.name}`,
        text,
        html,
      }),
    });
  } catch (cause) {
    // Service d'envoi injoignable : on le dit clairement plutôt que de
    // laisser croire que la demande est partie.
    console.error("Service d'envoi injoignable :", cause);
    return json(
      { error: "Le service d'envoi est momentanément indisponible." },
      503,
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error("Envoi refusé par Resend :", response.status, detail);
    return json(
      {
        error:
          "Le service d'envoi a refusé la demande. Réessayez dans un instant.",
      },
      502,
    );
  }

  return json({ ok: true }, 200);
}

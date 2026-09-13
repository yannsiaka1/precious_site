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

/**
 * Traduit un refus du service d'envoi en cause probable.
 * Les trois premiers cas couvrent la quasi-totalité des échecs rencontrés à
 * la mise en service.
 */
function diagnose(status: number, detail: string): string {
  const text = detail.toLowerCase();

  if (text.includes("testing emails") || text.includes("own email address")) {
    return (
      "Tant qu'aucun domaine n'est vérifié, Resend n'accepte d'envoyer que " +
      "vers l'adresse du titulaire du compte. CONTACT_TO doit correspondre " +
      "exactement à l'adresse d'inscription du compte Resend."
    );
  }
  if (text.includes("not verified") || text.includes("domain")) {
    return (
      "Le domaine de l'adresse d'expédition n'est pas vérifié dans Resend. " +
      "Garder CONTACT_FROM sur onboarding@resend.dev tant que le domaine " +
      "n'est pas en place."
    );
  }
  if (text.includes("sender") && text.includes("not valid")) {
    return (
      "L'adresse d'expédition n'est pas validée chez Brevo. Ajoutez-la dans " +
      "Senders & IP puis cliquez le lien de confirmation reçu par courriel."
    );
  }
  if (status === 401 || status === 403) {
    return "Clé d'API absente, incorrecte ou révoquée.";
  }
  if (status === 422) {
    return "Resend a rejeté un champ du courriel (from, to ou reply_to mal formé).";
  }
  if (status === 429) {
    return "Quota d'envoi Resend atteint.";
  }
  return `Refus non identifié du service d'envoi (HTTP ${status}).`;
}

/**
 * Texte de l'accusé de réception, selon la nature de la demande.
 *
 * Toutes les variantes suivent le même modèle : une salutation de marque, la
 * confirmation de ce qui a été reçu, l'annonce de la suite, et la signature
 * « Chaque expérience est précieuse ». Seule la phrase centrale change, pour
 * qu'un accusé de commande ne parle pas comme un remerciement d'avis.
 *
 * Aucun délai chiffré n'est promis : « très bientôt » n'engage pas comme
 * « sous 24 heures », qu'il faudrait tenir à chaque fois.
 */
function accuseReception(payload: Payload): {
  subject: string;
  text: string;
  html: string;
} {
  const prenom = payload.name.split(/\s+/)[0] ?? "";
  const sujet = payload.subject.toLowerCase();

  let titre: string;
  let objet: string;
  let corps: string;
  let suite =
    "Nous revenons vers vous très bientôt avec les prochaines étapes.";

  if (sujet.includes("témoignage")) {
    titre = "Merci pour votre avis 💎";
    objet = "Merci pour votre avis — Precious";
    corps =
      "Merci d'avoir pris le temps de partager votre expérience. Votre retour nous touche, et il nourrit tout ce que nous faisons.";
    suite =
      "Nous le lisons attentivement. S'il doit paraître sur notre site, nous vous en reparlerons avant.";
  } else if (sujet.includes("rappel")) {
    titre = "Bienvenue chez Precious 💎";
    objet = "Votre demande est bien reçue — Precious";
    corps =
      "Merci pour votre confiance. Votre demande de rappel a bien été reçue et sera traitée avec soin, passion et excellence.";
  } else if (sujet.includes("événement") || sujet.includes("cocktail")) {
    titre = "Bienvenue chez Precious 💎";
    objet = "Votre demande de devis est bien reçue — Precious";
    corps =
      "Merci pour votre confiance. Votre demande de devis a bien été reçue et sera étudiée avec soin, passion et excellence.";
    suite =
      "Nous revenons vers vous très bientôt avec une proposition : carte, quantités, déroulé et prix.";
  } else if (sujet.includes("formation") || sujet.includes("guide")) {
    titre = "Bienvenue chez Precious 💎";
    objet = "Votre demande est bien reçue — Precious";
    corps =
      "Merci pour votre confiance. Votre demande a bien été reçue et sera traitée avec soin, passion et excellence.";
  } else if (sujet.includes("jus") || sujet.includes("donut")) {
    titre = "Bienvenue chez Precious 💎";
    objet = "Votre commande est bien reçue — Precious";
    corps =
      "Merci pour votre confiance. Votre commande a bien été reçue et sera traitée avec soin, passion et excellence.";
  } else {
    // « Autre demande » et tout sujet non prévu : formulation neutre, qui ne
    // parle ni de commande ni de devis.
    titre = "Bienvenue chez Precious 💎";
    objet = "Votre message est bien reçu — Precious";
    corps =
      "Merci pour votre confiance. Votre message a bien été reçu et sera traité avec soin, passion et excellence.";
  }

  const signature = "Precious — Chaque expérience est précieuse";

  // Récapitulatif discret : la personne retrouve ce qu'elle a écrit, ce qui
  // évite les envois en double quand on doute d'avoir bien validé.
  const recap: Array<[string, string]> = [
    ["Nature de la demande", payload.subject],
    ["Téléphone", payload.phone],
    ["Date souhaitée", payload.date],
    ...Object.entries(payload.details),
  ].filter(([, valeur]) => valeur) as Array<[string, string]>;

  const text = [
    titre,
    "",
    prenom ? `Bonjour ${prenom},` : "Bonjour,",
    "",
    corps,
    "",
    suite,
    "",
    signature,
    "precious-jus.com · Montréal",
    "",
    "—",
    "Récapitulatif de votre demande :",
    ...recap.map(([label, valeur]) => `  ${label} : ${valeur}`),
    "",
    "Votre message :",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#17321f;line-height:1.65;max-width:540px">
      <h1 style="margin:0 0 22px;font-size:21px;font-weight:600;color:#0d5429">${escapeHtml(titre)}</h1>
      <p style="margin:0 0 16px">${prenom ? `Bonjour ${escapeHtml(prenom)},` : "Bonjour,"}</p>
      <p style="margin:0 0 16px">${escapeHtml(corps)}</p>
      <p style="margin:0 0 28px">${escapeHtml(suite)}</p>
      <p style="margin:0 0 4px;font-size:15px;color:#0d5429"><em>${escapeHtml(signature)}</em></p>
      <p style="margin:0 0 30px;font-size:13px;color:#5d6b60">
        <a href="https://precious-jus.com/" style="color:#5d6b60">precious-jus.com</a> · Montréal
      </p>
      <div style="padding-top:18px;border-top:1px solid #e4ded0">
        <p style="margin:0 0 10px;color:#5d6b60;font-size:12px;letter-spacing:.06em;text-transform:uppercase">Récapitulatif de votre demande</p>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
          ${recap
            .map(
              ([label, valeur]) => `<tr>
                <td style="padding:4px 18px 4px 0;color:#5d6b60;white-space:nowrap">${escapeHtml(label)}</td>
                <td style="padding:4px 0"><strong>${escapeHtml(valeur)}</strong></td>
              </tr>`,
            )
            .join("")}
        </table>
        <p style="margin:16px 0 6px;color:#5d6b60;font-size:12px;letter-spacing:.06em;text-transform:uppercase">Votre message</p>
        <p style="margin:0;padding:12px 14px;background:#f7f2e7;border-radius:8px;white-space:pre-wrap;font-size:14px">${escapeHtml(payload.message)}</p>
      </div>
    </div>`;

  /*
   * L'objet reste sans émoji : le domaine vient d'être authentifié et sa
   * réputation se construit. Un émoji en objet est parfois pénalisé par les
   * filtres pendant cette période — il figure dans le corps du message, où
   * il ne coûte rien.
   */
  return { subject: objet, text, html };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey && !process.env["BREVO_API_KEY"]) {
    // Aucun service configuré : le site retombera sur la messagerie du
    // visiteur, sans rien perdre de sa saisie.
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

  /*
   * Choix du service d'envoi.
   *
   * Brevo l'emporte s'il est configuré : il n'exige qu'une adresse
   * d'expéditeur vérifiée, là où Resend réclame un domaine vérifié pour
   * écrire ailleurs qu'au titulaire du compte.
   */
  const brevoKey = process.env["BREVO_API_KEY"];
  const from =
    process.env["CONTACT_FROM"] ?? "Precious <onboarding@resend.dev>";
  const to = process.env["CONTACT_TO"] ?? "Preciousck384@gmail.com";

  /** Sépare « Nom <adresse> » en ses deux parties. */
  function splitAddress(value: string): { name: string; email: string } {
    const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
    if (match) return { name: match[1] ?? "Precious", email: match[2]! };
    return { name: "Precious", email: value.trim() };
  }

  const sender = splitAddress(from);

  /*
   * Destinataire ramené en minuscules.
   *
   * Les services d'envoi comparent l'adressee caractère par caractère pour
   * vérifier leurs restrictions (Resend n'autorise l'écriture qu'au titulaire
   * du compte tant qu'aucun domaine n'est vérifié). Une simple majuscule dans
   * la variable suffit à faire échouer ce contrôle, alors que la livraison,
   * elle, ignore la casse.
   */
  const recipient = splitAddress(to.toLowerCase());

  /**
   * Expédie un courriel par le service configuré.
   * Une seule fonction pour les deux messages : la notification adressée à
   * Precious et l'accusé de réception adressé à la personne.
   */
  async function envoyer(message: {
    to: string;
    replyTo: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<Response> {
    return brevoKey
      ? fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sender: { name: sender.name, email: sender.email },
            to: [{ email: message.to }],
            replyTo: { email: message.replyTo },
            subject: message.subject,
            textContent: message.text,
            htmlContent: message.html,
          }),
        })
      : fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [message.to],
            reply_to: message.replyTo,
            subject: message.subject,
            text: message.text,
            html: message.html,
          }),
        });
  }

  let response: Response;
  try {
    // Notification à Precious. Répondre au courriel répond au client.
    response = await envoyer({
      to: recipient.email,
      replyTo: payload.email,
      subject: `Precious — ${payload.subject} — ${payload.name}`,
      text,
      html,
    });
  } catch (cause) {
    // Service d'envoi injoignable : on le dit clairement plutôt que de
    // laisser croire que la demande est partie.
    console.error("[contact] Service d'envoi injoignable :", cause);
    return json(
      { error: "Le service d'envoi est momentanément indisponible." },
      503,
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    const cause = diagnose(response.status, detail);

    /*
     * Journal détaillé, lisible dans Vercel → Logs, filtre /api/contact.
     * C'est ici que se lit la vraie cause d'un refus.
     */
    console.error(
      `[contact] Resend a refusé l'envoi — HTTP ${response.status} — ${detail}`,
    );
    console.error(`[contact] Cause probable : ${cause}`);

    /*
     * Un refus de Resend vient presque toujours de la configuration, pas de
     * la personne qui remplit le formulaire : on lui montre un message neutre
     * et on garde le diagnostic pour l'exploitant.
     *
     * `DEBUG_CONTACT=1` dans les variables Vercel ajoute le motif exact à la
     * réponse — pratique pendant la mise en service, à retirer ensuite.
     */
    return json(
      {
        error:
          "Le service d'envoi a refusé la demande. Écrivez-nous directement en attendant.",
        ...(process.env["DEBUG_CONTACT"] === "1"
          ? {
              diagnostic: cause,
              providerStatus: response.status,
              providerDetail: detail,
            }
          : {}),
      },
      502,
    );
  }

  /*
   * Accusé de réception adressé à la personne.
   *
   * Envoyé après la notification, et volontairement sans incidence sur la
   * réponse : si celui-ci échoue, la demande est déjà chez Precious, donc
   * l'essentiel est fait. On enregistre l'échec et on continue.
   *
   * `replyTo` pointe vers la boîte de Precious : une réponse du client
   * arrive donc chez elle même si l'adresse d'expédition ne reçoit rien.
   */
  try {
    const accuse = accuseReception(payload);
    const suite = await envoyer({
      to: payload.email,
      replyTo: recipient.email,
      subject: accuse.subject,
      text: accuse.text,
      html: accuse.html,
    });
    if (!suite.ok) {
      console.error(
        `[contact] Accusé de réception refusé — HTTP ${suite.status} — ${await suite.text()}`,
      );
    }
  } catch (cause) {
    console.error("[contact] Accusé de réception non envoyé :", cause);
  }

  return json({ ok: true }, 200);
}

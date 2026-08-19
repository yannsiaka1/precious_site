import { useState } from "react";
import { footerLinks, navigation, site } from "@/content/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { submitRequest, useFormStart } from "@/lib/submitRequest";
import { Reveal, STAGGER } from "@/components/ui/Reveal";

/**
 * Pied de page.
 *
 * Quatre colonnes : identité, navigation, coordonnées, prise de contact.
 * rapide. Le champ courriel ne crée pas d'inscription à une infolettre : il
 * reporte l'adresse saisie dans le formulaire de contact, plus haut.
 */

interface FooterProps {
  /** Reprend l'adresse saisie ici et l'amène au formulaire de contact. */
  onQuickWrite: (email: string) => void;
}

/** États du mini-formulaire de rappel. */
type QuickStatus = "idle" | "sending" | "sent" | "handoff" | "error";

export function Footer({ onQuickWrite }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<QuickStatus>("idle");
  const startedAt = useFormStart();
  const year = new Date().getFullYear();

  /**
   * Demande de rappel.
   *
   * L'adresse part immédiatement vers la boîte de Precious : la personne n'a
   * rien d'autre à faire. Si le service d'envoi n'est pas joignable, on la
   * conduit au formulaire complet plus haut plutôt que de perdre sa saisie.
   */
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    setStatus("sending");

    try {
      const result = await submitRequest({
        name: "Demande de rappel",
        email: address,
        phone: "",
        subject: "Rappel demandé",
        date: "",
        message:
          "Cette personne a laissé son adresse dans le pied de page du site pour être recontactée.",
        startedAt,
      });
      setStatus(result === "sent" ? "sent" : "handoff");
      setEmail("");
    } catch {
      setStatus("error");
      onQuickWrite(address);
    }
  }

  return (
    <footer className="grain page-x bg-leaf pt-20 pb-8 text-paper">
      <div className="mx-auto grid w-full max-w-[82rem] gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <Reveal>
          <p className="font-display text-3xl tracking-wide">{site.name}</p>
          <p className="mt-5 max-w-72 text-paper/75">{site.promise}</p>
          <SocialLinks className="mt-7" />
        </Reveal>

        <Reveal as="nav" delay={STAGGER} aria-label="Pied de page">
          <p className="text-eyebrow font-bold text-mango">Exploration</p>
          <ul className="mt-5 grid gap-3.5">
            {[...navigation, ...footerLinks].map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-paper/80 hover:text-paper">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <div>
          <p className="text-eyebrow font-bold text-mango">La maison</p>
          <ul className="mt-5 grid gap-3.5 text-paper/80">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-paper"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-paper"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>{site.contact.area}</li>
            <li>{site.contact.availability}</li>
          </ul>
        </div>

        <div>
          <p className="text-eyebrow font-bold text-mango">
            Un projet en tête ?
          </p>
          <p className="mt-5 text-paper/75">
            Laissez votre adresse : nous reprenons contact avec vous pour en
            parler.
          </p>

          <form onSubmit={submit} className="mt-6">
            <label htmlFor="footer-email" className="sr-only">
              Votre adresse courriel
            </label>
            <div className="flex items-center gap-3 border-b border-paper/40 focus-within:border-paper">
              <input
                id="footer-email"
                type="email"
                required
                maxLength={120}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@exemple.com"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-paper outline-none placeholder:text-paper/45"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                aria-label="Envoyer ma demande de rappel"
                className="grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-paper/15 disabled:opacity-50"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="15"
                  height="15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Retour d'état sous le champ : on ne laisse jamais la personne
                dans le doute sur ce qui s'est passé. */}
            <p
              aria-live="polite"
              className="mt-3 min-h-5 text-sm text-paper/70"
            >
              {status === "sending" && "Envoi en cours…"}
              {status === "sent" && "Merci, nous vous recontactons bientôt."}
              {status === "handoff" &&
                "Votre messagerie s'est ouverte : il ne reste qu'à envoyer."}
              {status === "error" &&
                "L'envoi a échoué — utilisez le formulaire ci-dessus."}
            </p>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[82rem] flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-6 text-sm text-paper/55">
        <p>
          © {year} {site.name}. Tous droits réservés.
        </p>
        <p>Montréal, Québec</p>
      </div>
    </footer>
  );
}

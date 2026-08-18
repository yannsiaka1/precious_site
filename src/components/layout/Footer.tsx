import { useState } from "react";
import { footerLinks, navigation, site } from "@/content/site";
import { SocialLinks } from "@/components/ui/SocialLinks";

interface FooterProps {
  /** Reprend l'adresse saisie ici et l'amène au formulaire de contact. */
  onQuickWrite: (email: string) => void;
}

export function Footer({ onQuickWrite }: FooterProps) {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onQuickWrite(email.trim());
    setEmail("");
  }

  return (
    <footer className="grain page-x bg-leaf pt-20 pb-8 text-paper">
      <div className="mx-auto grid w-full max-w-[82rem] gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-3xl tracking-wide">{site.name}</p>
          <p className="mt-5 max-w-72 text-paper/75">{site.promise}</p>
          <SocialLinks className="mt-7" />
        </div>

        <nav aria-label="Pied de page">
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
        </nav>

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
                aria-label="Poursuivre vers le formulaire de contact"
                className="grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-paper/15"
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

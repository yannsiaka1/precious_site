import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/site";
import { services } from "@/content/offerings";
import {
  submitRequest,
  useFormStart,
  type SubmitOutcome,
} from "@/lib/submitRequest";
import { EVENT_SUBJECT, eventFields } from "@/content/forms";
import { Field } from "@/components/ui/Field";
import { fieldClass, labelClass, limits } from "@/components/ui/formStyles";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, STAGGER } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Section « Contact » — dernier bloc de la page.
 *
 * À gauche : le discours et les coordonnées, tirés de `content/site.ts`.
 * À droite : le formulaire général, celui qui accepte n'importe quel sujet.
 * Les trois autres formulaires (un par univers) vivent dans RequestForm et
 * partagent avec celui-ci le moteur d'envoi (`lib/submitRequest`) et les
 * styles de champ (`ui/formStyles`).
 *
 * Le sujet est piloté depuis la page pour qu'un clic ailleurs puisse le
 * pré-sélectionner ; `prefillEmail` reçoit l'adresse saisie en pied de page.
 */

type Status = "idle" | "sending" | "done" | "error";

const subjects = [
  ...services.map((service) => service.title),
  "Formation",
  "Guide Precious",
  "Autre demande",
];

interface ContactProps {
  subject: string;
  onSubjectChange: (subject: string) => void;
  /** Adresse pré-remplie depuis le pied de page. */
  prefillEmail: string;
}

export function Contact({
  subject,
  onSubjectChange,
  prefillEmail,
}: ContactProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [outcome, setOutcome] = useState<SubmitOutcome>("sent");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useFormStart();
  const confirmationRef = useRef<HTMLDivElement>(null);
  const ids = useId();

  // Adresse venue du pied de page : on la reporte dans le champ courriel.
  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail]);

  useEffect(() => {
    if (status === "done")
      confirmationRef.current?.focus({ preventScroll: true });
  }, [status]);

  /**
   * Envoi du formulaire.
   * Les valeurs sont nettoyées et bornées dans `submitRequest` : la
   * validation du navigateur empêche les erreurs de saisie, pas les requêtes
   * forgées.
   */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Piège à robots : ce champ est invisible, seul un script le remplit.
    if (data.get("website")) return;

    setStatus("sending");
    setError("");

    // Les questions événementielles ne sont envoyées que si elles étaient
    // affichées, c'est-à-dire si la demande concerne un événement.
    const details: Record<string, string> = {};
    if (subject === EVENT_SUBJECT) {
      for (const field of eventFields) {
        details[field.label] = String(data.get(field.name) ?? "");
      }
    }

    try {
      const result = await submitRequest({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        subject: String(data.get("subject") ?? ""),
        date: String(data.get("date") ?? ""),
        message: String(data.get("message") ?? ""),
        details,
        startedAt,
      });
      setOutcome(result);
      setStatus("done");
      formRef.current?.reset();
      setEmail("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "L'envoi n'a pas abouti. Réessayez ou écrivez-nous directement.",
      );
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="grain page-x bg-lime/60 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          eyebrow="Parlons de votre projet"
          title="Parlons de demain"
        />

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20">
          <Reveal>
            <p className="text-eyebrow text-gold-ink">Écrivez-nous</p>
            <p className="mt-5 max-w-[26ch] font-display text-[clamp(1.4rem,2.1vw,2rem)] leading-[1.25] text-forest">
              Quelle expérience créons-nous pour vous ?
            </p>

            <div className="mt-7 grid gap-4 text-[clamp(1.02rem,1.2vw,1.15rem)] leading-[1.55] text-ink/80">
              <p className="max-w-[38ch]">
                Un anniversaire, un mariage, une réception d'entreprise, une
                commande de jus pour la semaine ou une boîte de donuts à offrir
                : dites-nous l'occasion, le nombre de personnes et la date.
              </p>
              <p className="max-w-[38ch]">
                Nous revenons vers vous avec une proposition claire — carte,
                quantités, délais et prix — sans engagement de votre part.
              </p>
            </div>

            <ul className="mt-9 grid gap-2.5">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-display text-lg text-forest decoration-1 underline-offset-[6px] hover:underline"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                  className="font-display text-lg text-forest decoration-1 underline-offset-[6px] hover:underline"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="font-ui text-xs font-bold tracking-[0.14em] text-ink/55 uppercase">
                {site.contact.area} · {site.contact.availability}
              </li>
            </ul>
          </Reveal>

          <Reveal delay={STAGGER}>
            <div className="rounded-2xl bg-paper/85 p-6 shadow-(--shadow-soft) backdrop-blur-sm sm:p-9 lg:p-11">
              {status === "done" ? (
                <div
                  ref={confirmationRef}
                  tabIndex={-1}
                  className="grid min-h-80 place-content-center justify-items-center text-center outline-none"
                >
                  <svg
                    viewBox="0 0 48 48"
                    width="48"
                    height="48"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 14l18 13L42 14M6 12h36v24H6z"
                      stroke="var(--color-forest)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h3 className="mt-6 text-[clamp(1.5rem,2.2vw,2rem)] text-forest">
                    {outcome === "sent"
                      ? "Votre demande est partie."
                      : "Votre message est prêt à partir."}
                  </h3>
                  <p className="mt-4 max-w-sm text-ink/70">
                    {outcome === "sent"
                      ? "Merci pour votre confiance. Nous revenons vers vous rapidement."
                      : "Votre messagerie s'est ouverte avec la demande pré-remplie. Il ne reste qu'à l'envoyer."}
                  </p>
                  <Button
                    variant="red"
                    className="mt-8"
                    onClick={() => setStatus("idle")}
                  >
                    Faire une autre demande
                  </Button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={onSubmit}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <p aria-hidden="true" className="hidden">
                    <label>
                      Ne pas remplir
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </p>

                  <label htmlFor={`${ids}-name`} className={labelClass}>
                    Nom complet
                    <input
                      id={`${ids}-name`}
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Votre nom"
                      className={fieldClass}
                      {...limits.name}
                    />
                  </label>

                  <label htmlFor={`${ids}-email`} className={labelClass}>
                    Courriel
                    <input
                      id={`${ids}-email`}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={fieldClass}
                      {...limits.email}
                    />
                  </label>

                  <label htmlFor={`${ids}-phone`} className={labelClass}>
                    Téléphone
                    <input
                      id={`${ids}-phone`}
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="514 000 0000"
                      className={fieldClass}
                      {...limits.phone}
                    />
                  </label>

                  <label htmlFor={`${ids}-date`} className={labelClass}>
                    Date souhaitée
                    <input
                      id={`${ids}-date`}
                      name="date"
                      type="date"
                      required
                      className={fieldClass}
                    />
                  </label>

                  <fieldset className="col-span-full border-0 p-0">
                    <legend className={cn(labelClass, "mb-3")}>
                      Nature de votre demande
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((option) => (
                        <label
                          key={option}
                          className={cn(
                            "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                            subject === option
                              ? "border-forest bg-forest text-paper"
                              : "border-forest/30 text-forest hover:border-forest",
                          )}
                        >
                          <input
                            type="radio"
                            name="subject"
                            value={option}
                            checked={subject === option}
                            onChange={() => onSubjectChange(option)}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Questions ouvertes uniquement pour une demande
                      événementielle : elles permettent de chiffrer un devis
                      dès le premier échange. */}
                  {subject === EVENT_SUBJECT ? (
                    <fieldset className="col-span-full grid animate-[panel_450ms_var(--ease-out-soft)_both] gap-5 rounded-xl border border-forest/20 bg-cream/50 p-5 sm:grid-cols-2 sm:p-6">
                      <legend className="px-2 font-display text-base text-forest">
                        Votre événement
                      </legend>
                      {eventFields.map((field) => (
                        <Field key={field.name} field={field} />
                      ))}
                    </fieldset>
                  ) : null}

                  <label
                    htmlFor={`${ids}-message`}
                    className={cn(labelClass, "col-span-full")}
                  >
                    Votre projet
                    <textarea
                      id={`${ids}-message`}
                      name="message"
                      rows={4}
                      required
                      placeholder="Type d'occasion, nombre de personnes, quantités, questions…"
                      className={cn(fieldClass, "resize-y")}
                      {...limits.message}
                    />
                  </label>

                  {status === "error" ? (
                    <p
                      role="alert"
                      className="col-span-full text-sm text-[#a12d1c]"
                    >
                      {error} Vous pouvez aussi écrire à{" "}
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="underline"
                      >
                        {site.contact.email}
                      </a>
                      .
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    variant="red"
                    size="lg"
                    disabled={status === "sending"}
                    className="col-span-full mt-1 w-fit"
                  >
                    {status === "sending"
                      ? "Envoi en cours…"
                      : "Envoyer ma demande"}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

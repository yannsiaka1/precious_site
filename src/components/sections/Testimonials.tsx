import { useEffect, useId, useRef, useState } from "react";
import { testimonials } from "@/content/offerings";
import { site } from "@/content/site";
import { submitRequest, useFormStart } from "@/lib/submitRequest";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { fieldClass, labelClass, limits } from "@/components/ui/formStyles";
import { cn } from "@/lib/cn";

/**
 * Section « Témoignages ».
 *
 * Un avis à la fois, en rotation automatique (DELAY), avec arrêt au survol,
 * au focus clavier et pendant la saisie d'un nouvel avis. Le bouton
 * « Laisser un avis » déplie ShareForm, qui passe par le même moteur d'envoi
 * que les formulaires de commande.
 *
 * ⚠️ Les avis affichés viennent de `content/offerings.ts` et sont encore des
 * textes de démonstration — voir l'avertissement sur place.
 */

/** Durée d'affichage d'un avis avant de passer au suivant, en millisecondes. */
const DELAY = 4500;

/** Formulaire d'avis : même moteur d'envoi que les autres formulaires. */
function ShareForm({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [outcome, setOutcome] = useState<"sent" | "handoff">("sent");
  const [error, setError] = useState("");
  const ids = useId();
  const startedAt = useFormStart();
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstField.current?.focus({ preventScroll: true });
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("website")) return;

    setStatus("sending");
    try {
      const result = await submitRequest({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: "",
        subject: "Témoignage",
        website: String(data.get("website") ?? ""),
        date: "",
        message: String(data.get("message") ?? ""),
        details: { Occasion: String(data.get("occasion") ?? "") },
        startedAt,
      });
      setOutcome(result);
      setStatus("done");
    } catch (cause) {
      // On remonte le motif exact renvoyé par le serveur : sans lui, la
      // personne ne sait pas quoi corriger.
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "L'envoi n'a pas abouti.",
      );
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-10 rounded-2xl bg-paper/80 p-8 text-center">
        <p className="font-display text-xl text-forest">
          Merci pour votre avis.
        </p>
        <p className="mt-3 text-ink/70">
          {outcome === "sent"
            ? "Il nous est parvenu. Nous le publierons après vous en avoir reparlé."
            : "Votre messagerie s'est ouverte avec l'avis pré-rempli : il ne reste qu'à l'envoyer."}
        </p>
        <Button variant="red" className="mt-7" onClick={onClose}>
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 grid gap-5 rounded-2xl bg-paper/80 p-6 text-left sm:grid-cols-2 sm:p-9"
    >
      <p aria-hidden="true" className="hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <label htmlFor={`${ids}-name`} className={labelClass}>
        Votre nom
        <input
          ref={firstField}
          id={`${ids}-name`}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Prénom et initiale"
          className={fieldClass}
          {...limits.name}
        />
      </label>

      <label htmlFor={`${ids}-occasion`} className={labelClass}>
        L'occasion
        <input
          id={`${ids}-occasion`}
          name="occasion"
          type="text"
          required
          placeholder="Mariage, commande, formation…"
          className={fieldClass}
          {...limits.text}
        />
      </label>

      <label
        htmlFor={`${ids}-email`}
        className={cn(labelClass, "sm:col-span-2")}
      >
        Courriel{" "}
        <span className="lowercase tracking-normal">
          (pour vous recontacter)
        </span>
        <input
          id={`${ids}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="vous@exemple.com"
          className={fieldClass}
          {...limits.email}
        />
      </label>

      <label
        htmlFor={`${ids}-message`}
        className={cn(labelClass, "sm:col-span-2")}
      >
        Votre témoignage
        <textarea
          id={`${ids}-message`}
          name="message"
          rows={4}
          required
          minLength={20}
          placeholder="Racontez-nous en quelques mots…"
          className={cn(fieldClass, "resize-y")}
          {...limits.message}
        />
      </label>

      {status === "error" ? (
        <p role="alert" className="text-sm text-[#a12d1c] sm:col-span-2">
          {error} Vous pouvez aussi écrire à{" "}
          <a href={`mailto:${site.contact.email}`} className="underline">
            {site.contact.email}
          </a>
          .
        </p>
      ) : null}

      <div className="flex flex-wrap gap-4 sm:col-span-2">
        <Button type="submit" variant="red" disabled={status === "sending"}>
          {status === "sending" ? "Envoi en cours…" : "Envoyer mon avis"}
        </Button>
        <Button type="button" variant="forest" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

/** Carrousel d'avis : défilement automatique, arrêt au survol et au focus. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sharing, setSharing] = useState(false);
  const current = testimonials[index] ?? testimonials[0]!;

  useEffect(() => {
    if (paused || sharing || testimonials.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      DELAY,
    );
    return () => window.clearInterval(timer);
  }, [paused, sharing]);

  return (
    <section
      id="temoignages"
      className="page-x bg-blush py-20 md:py-28 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          eyebrow="Notre communauté"
          title="Les échos de notre passage"
        />

        <div className="relative mx-auto mt-24 max-w-[52rem]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -left-1 font-display text-[7rem] leading-none text-mango-soft select-none lg:-left-10"
          >
            &rdquo;
          </span>

          <p className="text-eyebrow text-center text-gold-ink">
            Ce qu'ils disent
          </p>

          <figure
            key={current.author}
            className="mt-8 animate-[fade_700ms_var(--ease-out-soft)_both]"
            aria-live="polite"
          >
            <blockquote className="text-center text-[clamp(1.2rem,1.9vw,1.7rem)] leading-[1.5] text-ink">
              « {current.quote} »
            </blockquote>

            <span
              aria-hidden="true"
              className="mx-auto mt-9 block h-px w-28 bg-ink/25"
            />

            <figcaption className="mt-6 text-center">
              <span className="block font-display text-lg tracking-wide text-forest">
                {current.author}
              </span>
              <span className="mt-1 block text-ink/60">{current.role}</span>
            </figcaption>
          </figure>

          <div className="mt-10 flex justify-center gap-3">
            {testimonials.map((item, position) => (
              <button
                key={item.author}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Avis de ${item.author}`}
                aria-current={position === index ? "true" : undefined}
                className={cn(
                  "size-2.5 rounded-full border border-ink/40 transition-colors",
                  position === index ? "bg-ink/70" : "hover:bg-ink/20",
                )}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            {sharing ? (
              <ShareForm onClose={() => setSharing(false)} />
            ) : (
              <>
                <p className="text-ink/70">Vous avez fait appel à Precious ?</p>
                <Button
                  variant="red"
                  className="mt-5"
                  onClick={() => setSharing(true)}
                  aria-expanded={sharing}
                >
                  Laisser un avis
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

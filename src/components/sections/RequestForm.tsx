import { useEffect, useId, useRef, useState } from "react";
import type { Service } from "@/content/types";
import { site } from "@/content/site";
import {
  submitRequest,
  useFormStart,
  type SubmitOutcome,
} from "@/lib/submitRequest";
import { Field } from "@/components/ui/Field";
import { fieldClass, labelClass, limits } from "@/components/ui/formStyles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "done" | "error";

interface RequestFormProps {
  service: Service;
  /** Referme le formulaire et revient à la présentation de l'univers. */
  onClose: () => void;
}

/**
 * Formulaire de commande d'un univers, chargé sur place à la demande.
 * Même écriture et mêmes états que le formulaire de bas de page ; seuls les
 * champs propres au service changent.
 */
export function RequestForm({ service, onClose }: RequestFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [outcome, setOutcome] = useState<SubmitOutcome>("sent");
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLParagraphElement>(null);
  const ids = useId();
  const startedAt = useFormStart();

  // À l'ouverture comme après l'envoi, on place le focus : au clavier, on sait
  // que le panneau a changé.
  useEffect(() => {
    // preventScroll : on donne le focus sans faire sauter la page.
    headingRef.current?.focus({ preventScroll: true });
  }, [status, service.id]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("website")) return; // piège à robots

    setStatus("sending");
    setError("");

    const details: Record<string, string> = {};
    for (const field of service.fields) {
      if (field.name === "date") continue;
      details[field.label] = String(data.get(field.name) ?? "");
    }

    try {
      const result = await submitRequest({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        subject: service.title,
        date: String(data.get("date") ?? ""),
        message: String(data.get("message") ?? ""),
        details,
        startedAt,
      });
      setOutcome(result);
      setStatus("done");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "L'envoi n'a pas abouti. Réessayez ou écrivez-nous directement.",
      );
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center px-8 py-14 text-center">
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
        <p
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 font-display text-2xl text-forest"
        >
          {outcome === "sent"
            ? "Votre demande est partie."
            : "Votre message est prêt à partir."}
        </p>
        <p className="mt-3 max-w-sm text-ink/70">
          {outcome === "sent"
            ? "Merci pour votre confiance. Nous revenons vers vous rapidement."
            : "Votre messagerie s'est ouverte avec la demande pré-remplie. Il ne reste qu'à l'envoyer."}
        </p>
        <Button variant="red" className="mt-8" onClick={onClose}>
          Revenir à {service.title.toLowerCase()}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 lg:p-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-eyebrow text-gold-ink">Votre demande</p>
          <p
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 font-display text-[clamp(1.5rem,2.2vw,2rem)] text-forest outline-none"
          >
            {service.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-1 shrink-0 font-ui text-xs font-bold tracking-[0.14em] text-ink/50 uppercase transition-colors hover:text-brand-red"
        >
          Retour
        </button>
      </div>

      <p className="mt-4 max-w-prose text-ink/70">{service.formIntro}</p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
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
            className={fieldClass}
            {...limits.email}
          />
        </label>

        <label
          htmlFor={`${ids}-phone`}
          className={cn(labelClass, "sm:col-span-2")}
        >
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

        {/* Champs propres au service (quantité, date, nombre d'invités…),
            décrits dans content/offerings.ts. */}
        {service.fields.map((field) => (
          <Field key={field.name} field={field} />
        ))}

        <label
          htmlFor={`${ids}-message`}
          className={cn(labelClass, "sm:col-span-2")}
        >
          Votre demande
          <textarea
            id={`${ids}-message`}
            name="message"
            rows={3}
            required
            placeholder="Parfums, contraintes, questions…"
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

        <Button
          type="submit"
          variant="red"
          disabled={status === "sending"}
          className="mt-2 w-fit sm:col-span-2"
        >
          {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
        </Button>
      </form>
    </div>
  );
}

import { useState } from "react";
import type { ServiceId } from "@/content/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SavoirFaire } from "@/components/sections/SavoirFaire";
import { Services } from "@/components/sections/Services";
import { Academy } from "@/components/sections/Academy";
import { Maison } from "@/components/sections/Maison";
import { Realisations } from "@/components/sections/Realisations";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function App() {
  const [subject, setSubject] = useState("Cocktails & événements");
  const [activeService, setActiveService] = useState<ServiceId>("jus");
  const [prefillEmail, setPrefillEmail] = useState("");

  /**
   * Amène le visiteur à la destination d'une carte « savoir-faire » :
   * l'académie, ou l'univers correspondant avec le bon onglet déjà ouvert.
   */
  function goTo(target: ServiceId | "academie") {
    if (target === "academie") {
      document
        .getElementById("academie")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setActiveService(target);
    document
      .getElementById("creations")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  /** Adresse saisie en pied de page : on la reporte dans le formulaire. */
  function quickWrite(email: string) {
    setPrefillEmail(email);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
      >
        Aller au contenu
      </a>

      <Header />

      <main id="contenu">
        <Hero />
        <SavoirFaire onGoTo={goTo} />
        <Services activeId={activeService} onActiveChange={setActiveService} />
        <Academy />
        <Maison />
        <Realisations />
        <Testimonials />
        <Contact
          subject={subject}
          onSubjectChange={setSubject}
          prefillEmail={prefillEmail}
        />
      </main>

      <Footer onQuickWrite={quickWrite} />
    </>
  );
}

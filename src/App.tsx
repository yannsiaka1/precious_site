import { useEffect, useState } from "react";
import type { ServiceId } from "@/content/types";
import { defilerVers, installerDefilementAncres } from "@/lib/defiler";
import { useRecouvrement } from "@/hooks/useRecouvrement";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Intro } from "@/components/sections/Intro";
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

  // Tous les liens d'ancre de la page passent par un défilement de durée
  // bornée, posé une seule fois ici.
  useEffect(() => installerDefilementAncres(), []);

  // Le bloc du site recouvre l'ouverture au défilement. La référence se pose
  // sur ce qui recouvre ; l'avancement est écrit sur ce qui est recouvert.
  const recouvrant = useRecouvrement<HTMLDivElement>("intro");

  /**
   * Amène le visiteur à la destination d'une carte « savoir-faire » :
   * l'académie, ou l'univers correspondant avec le bon onglet déjà ouvert.
   */
  function goTo(target: ServiceId | "academie") {
    if (target === "academie") {
      defilerVers("academie");
      return;
    }
    setActiveService(target);
    defilerVers("creations");
  }

  /** Adresse saisie en pied de page : on la reporte dans le formulaire. */
  function quickWrite(email: string) {
    setPrefillEmail(email);
    defilerVers("contact");
  }

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
      >
        Aller au contenu
      </a>

      {/*
        L'ouverture et le reste du site sont frères dans un même bloc
        positionné. C'est ce qui permet le recouvrement : l'ouverture est
        collante et reste épinglée, le bloc du site passe par-dessus.

        L'en-tête est à l'intérieur du bloc recouvrant, et non avant lui.
        Deux raisons : il monte avec le site au lieu de flotter au-dessus de
        la vidéo, où son texte sombre serait illisible ; et il ne se fige en
        haut de fenêtre qu'une fois l'ouverture dépassée.
      */}
      <div className="relative">
        <Intro />

        {/*
          Le bloc qui recouvre. Ses coins s'arrondissent quand il arrive par
          le bas puis s'aplatissent une fois calé en haut, et une ombre portée
          vers le haut le détache de l'ouverture : c'est ce qui le fait lire
          comme une surface qui glisse par-dessus, et non comme une simple
          section qui suit.

          Le fond opaque est indispensable : sans lui, l'ouverture restée
          épinglée se verrait par transparence à travers toute la page.
        */}
        <div
          ref={recouvrant}
          style={{
            borderTopLeftRadius: "calc((1 - var(--recouvrement, 0)) * 2.75rem)",
            borderTopRightRadius:
              "calc((1 - var(--recouvrement, 0)) * 2.75rem)",
          }}
          className="relative z-10 bg-blush shadow-[0_-26px_52px_-18px_rgba(7,57,28,0.5)]"
        >
          <Header />

          <main id="contenu">
            <Hero />
            <SavoirFaire onGoTo={goTo} />
            <Services
              activeId={activeService}
              onActiveChange={setActiveService}
            />
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
        </div>
      </div>
    </>
  );
}

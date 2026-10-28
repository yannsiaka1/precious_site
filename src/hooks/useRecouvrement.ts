import { useEffect, useRef } from "react";

/**
 * Avancement du recouvrement d'une section par celle qui la suit.
 *
 * Retourne une référence à poser sur la section qui recouvre. Tant qu'elle
 * monte dans l'écran, la valeur `--recouvrement` est écrite sur l'élément
 * désigné par `cible` : 0 quand le haut de la section recouvrante touche le
 * bas de la fenêtre, 1 quand il atteint le haut.
 *
 * Pourquoi écrire une variable CSS plutôt que d'appeler `setState` : un état
 * React relancerait le rendu de l'arbre à chaque image de défilement. Une
 * variable CSS est lue par le compositeur du navigateur sans repasser par
 * JavaScript, et les propriétés qu'elle pilote ici — `transform` et
 * `opacity` — n'entraînent ni recalcul de mise en page ni repeinture.
 *
 * Pourquoi pas de bibliothèque : le dépôt n'embarque que React. Les deux
 * paquets habituels pour ce genre d'effet pèsent, à eux deux, plus que tout
 * le JavaScript actuel du site. Quarante lignes suffisent.
 *
 * Pourquoi pas `animation-timeline: view()`, qui ferait cela en CSS pur :
 * Safari ne le gère pas encore, et c'est un navigateur majoritaire sur les
 * téléphones au Québec.
 */
export function useRecouvrement<T extends HTMLElement>(cible: string) {
  const section = useRef<T>(null);

  useEffect(() => {
    const element = section.current;
    const recouvert = document.getElementById(cible);
    if (!element || !recouvert) return;

    /*
      La variable est écrite sur le parent commun, pas sur la section
      recouverte. Une variable CSS descend aux enfants, elle ne traverse pas
      entre frères : posée sur la seule section recouverte, le bloc qui
      recouvre — son frère — ne pourrait pas la lire, et ne pourrait donc pas
      arrondir ses coins au même rythme.
    */
    const porteur = element.parentElement ?? recouvert;

    // Respecte le réglage système : sans animation, la section recouverte
    // reste simplement immobile et pleinement visible.
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)");

    let demande = 0;
    let dernier = -1;

    const mesurer = () => {
      demande = 0;
      if (calme.matches) {
        porteur.style.removeProperty("--recouvrement");
        recouvert.removeAttribute("data-couvert");
        return;
      }

      const haut = element.getBoundingClientRect().top;
      const fenetre = window.innerHeight;
      // 0 quand le haut de la section arrive par le bas, 1 quand il se cale
      // en haut de la fenêtre.
      const brut = 1 - haut / fenetre;
      const valeur = Math.min(1, Math.max(0, brut));

      // On n'écrit qu'au centième près : au-delà, l'œil ne distingue rien et
      // chaque écriture invalide le style de l'élément pour rien.
      const arrondi = Math.round(valeur * 100) / 100;
      if (arrondi === dernier) return;
      dernier = arrondi;
      porteur.style.setProperty("--recouvrement", String(arrondi));

      // Entièrement recouverte, la section n'a plus de raison d'exister pour
      // le navigateur : une vidéo plein écran laissée à composer sous une
      // page opaque consomme du processeur graphique et de la batterie pour
      // des images que personne ne voit. L'attribut permet au CSS de la
      // masquer et au composant de mettre la lecture en pause.
      recouvert.toggleAttribute("data-couvert", arrondi >= 0.995);
    };

    const planifier = () => {
      // Une seule mesure par image : le défilement émet bien plus souvent
      // que le navigateur ne redessine.
      if (!demande) demande = requestAnimationFrame(mesurer);
    };

    mesurer();
    window.addEventListener("scroll", planifier, { passive: true });
    window.addEventListener("resize", planifier, { passive: true });
    calme.addEventListener("change", planifier);

    return () => {
      if (demande) cancelAnimationFrame(demande);
      window.removeEventListener("scroll", planifier);
      window.removeEventListener("resize", planifier);
      calme.removeEventListener("change", planifier);
      porteur.style.removeProperty("--recouvrement");
      recouvert.removeAttribute("data-couvert");
    };
  }, [cible]);

  return section;
}

import { useEffect, useRef, useState } from "react";
import { defilerVers } from "@/lib/defiler";
import { site } from "@/content/site";

/**
 * Bandeau d'ouverture : la vidéo de présentation, en plein écran.
 *
 * Elle se place AVANT l'en-tête dans la page, pas après. Ce n'est pas un
 * détail de rangement : l'en-tête est en `sticky top-0`, donc tant qu'il
 * n'a pas atteint le haut de la fenêtre il reste dans le flux. Placé après
 * cette section, il n'apparaît qu'une fois la vidéo dépassée. On arrive
 * ainsi sur la vidéo seule, et le site se révèle au défilement — exactement
 * le comportement voulu, sans une ligne de JavaScript de défilement.
 *
 * Le passer au-dessus règle aussi un problème de lisibilité : l'en-tête est
 * transparent tant qu'on n'a pas défilé, et son texte sombre serait illisible
 * sur le vert profond de la vidéo.
 *
 * Deux fichiers existent, l'un en 16:9 pour les écrans larges, l'autre en
 * 9:16 pour les téléphones. Le choix se fait en JavaScript plutôt qu'avec
 * `<source media>` : cet attribut n'est évalué qu'au chargement et ne suit
 * pas un changement d'orientation, et surtout plusieurs navigateurs
 * téléchargent quand même les deux fichiers. Ici, un seul part sur le réseau.
 */

/** En deçà, on sert la vidéo verticale. Même seuil que `lg:` en Tailwind. */
const SEUIL_LARGE = 1024;

export function Intro() {
  const video = useRef<HTMLVideoElement>(null);

  /**
   * `null` tant que la mesure n'a pas eu lieu.
   *
   * La page est prérendue au build, où ni la largeur de l'écran ni les
   * préférences d'animation n'existent. On ne choisit donc aucune source
   * avant d'être dans un vrai navigateur : l'image d'affiche occupe l'écran
   * pendant ce temps, et elle ne pèse que quatre kilo-octets.
   */
  const [large, setLarge] = useState<boolean | null>(null);
  const [anime, setAnime] = useState(true);
  const [sonActif, setSonActif] = useState(false);

  useEffect(() => {
    const ecran = window.matchMedia(`(min-width: ${SEUIL_LARGE}px)`);
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)");

    const relever = () => {
      setLarge(ecran.matches);
      setAnime(!calme.matches);
    };
    relever();

    ecran.addEventListener("change", relever);
    calme.addEventListener("change", relever);
    return () => {
      ecran.removeEventListener("change", relever);
      calme.removeEventListener("change", relever);
    };
  }, []);

  /**
   * Relance la lecture si le navigateur l'a refusée.
   *
   * `autoPlay` suffit dans l'immense majorité des cas puisque la vidéo est
   * muette, mais certains réglages d'économie d'énergie la bloquent. On
   * redemande explicitement, et on ignore un nouveau refus : l'image
   * d'affiche reste alors affichée, ce qui est un repli acceptable.
   */
  useEffect(() => {
    if (large === null || !anime) return;
    video.current?.play().catch(() => undefined);
  }, [large, anime]);

  /**
   * Met la lecture en pause dès que la section est entièrement recouverte,
   * et la relance quand elle réapparaît.
   *
   * L'observateur surveille l'attribut que `useRecouvrement` pose sur cette
   * même section. Passer par le DOM plutôt que par une propriété React évite
   * de faire remonter l'état du défilement jusqu'à `App` pour le redescendre
   * ensuite — et surtout de relancer un rendu à chaque image.
   */
  useEffect(() => {
    const element = document.getElementById("intro");
    const lecteur = video.current;
    if (!element || !lecteur) return;

    const suivre = () => {
      if (element.hasAttribute("data-couvert")) lecteur.pause();
      else lecteur.play().catch(() => undefined);
    };

    const observateur = new MutationObserver(suivre);
    observateur.observe(element, { attributeFilter: ["data-couvert"] });
    return () => observateur.disconnect();
  }, [large, anime]);

  function basculerSon() {
    const lecteur = video.current;
    if (!lecteur) return;
    const nouveau = !sonActif;
    lecteur.muted = !nouveau;
    setSonActif(nouveau);
    if (nouveau) lecteur.play().catch(() => undefined);
  }

  const suffixe = large ? "pc" : "mobile";

  return (
    <section
      id="intro"
      aria-label={`${site.name} en images`}
      /*
        `sticky top-0` : la section reste épinglée pendant que le site monte
        par-dessus. `origin-top` pour que le léger recul se fasse depuis le
        haut du cadre, sinon l'image semble glisser vers le bas.

        Les trois propriétés pilotées par `--recouvrement` sont écrites en
        style direct : elles dépendent d'une variable que le JavaScript met à
        jour à chaque image, ce qu'une classe utilitaire ne sait pas exprimer.
        Toutes trois — transform, opacity, border-radius — sont traitées par
        le compositeur, sans recalcul de mise en page.

        `[&[data-couvert]]:invisible` : une fois la section entièrement
        masquée, on la retire de la composition. Rien ne la regarde plus.
      */
      style={{
        transform: "scale(calc(1 - 0.06 * var(--recouvrement, 0)))",
        borderBottomLeftRadius: "calc(var(--recouvrement, 0) * 2.75rem)",
        borderBottomRightRadius: "calc(var(--recouvrement, 0) * 2.75rem)",
      }}
      className="sticky top-0 h-svh w-full origin-top overflow-hidden bg-forest-deep [&[data-couvert]]:invisible"
    >
      {/*
        `prefers-reduced-motion` : on ne joue rien et on montre une image fixe
        choisie pour être parlante, au lieu du premier plan du film qui n'est
        qu'un fond vert. Le visiteur qui a demandé moins d'animation ne doit
        pas se retrouver devant un écran vide.
      */}
      {anime && large !== null ? (
        <video
          ref={video}
          key={suffixe}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`/assets/video/affiche-${suffixe}.webp`}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src={`/assets/video/accueil-${suffixe}.mp4`}
            type="video/mp4"
          />
        </video>
      ) : large === null ? /*
          Mesure pas encore faite : on n'affiche rien du tout.

          Tentant d'y mettre une image d'attente, mais laquelle ? Sans
          connaître la largeur de l'écran, ce serait forcément la mauvaise une
          fois sur deux, et le navigateur l'aurait déjà téléchargée avant
          qu'on puisse la remplacer. Le fond vert de la section est de toute
          façon la première image exacte du film : il n'y a rien à cacher.
        */
      null : (
        <img
          src={`/assets/video/repli-${large ? "pc" : "mobile"}.webp`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/*
        Assombrissement progressif pendant que le site recouvre la section.
        Sans lui, l'ouverture resterait aussi lumineuse que le contenu qui
        arrive, et les deux se disputeraient le regard au lieu de se passer
        le relais.
      */}
      <div
        aria-hidden="true"
        style={{ opacity: "calc(var(--recouvrement, 0) * 0.72)" }}
        className="pointer-events-none absolute inset-0 z-[5] bg-forest-deep"
      />

      {/*
        Voile en pied de cadre. Il ne décore pas : sans lui, l'invitation à
        défiler se poserait par moments sur une photo claire et deviendrait
        illisible. Il ne couvre que le bas, là où le film ne place jamais
        d'information.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-forest-deep/75 to-transparent"
      />

      {/* Activation du son, en haut à droite. La lecture automatique est
          forcément muette ; ce bouton rend la bande-son accessible à qui la
          veut, sans l'imposer. */}
      {anime && large !== null ? (
        <button
          type="button"
          onClick={basculerSon}
          aria-pressed={sonActif}
          className="absolute top-6 right-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink/35 text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-ink/55 sm:top-8 sm:right-8"
        >
          <span className="sr-only">
            {sonActif
              ? "Couper le son de la vidéo"
              : "Activer le son de la vidéo"}
          </span>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {sonActif ? (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </>
            ) : (
              <path d="m16 9 5 6m0-6-5 6" />
            )}
          </svg>
        </button>
      ) : null}

      {/* Invitation à défiler. C'est un vrai bouton et non une simple flèche
          décorative : au clavier comme au lecteur d'écran, il faut un moyen
          d'atteindre le site sans dépendre de la molette. */}
      <button
        type="button"
        onClick={() => defilerVers("accueil")}
        className="group absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-paper"
      >
        <span className="font-ui text-xs font-bold tracking-[0.2em] uppercase">
          Découvrir
        </span>
        <span
          aria-hidden="true"
          // `float` existe déjà dans la feuille de styles, utilisée ailleurs
          // sur la page : on la réemploie plutôt que d'en déclarer une
          // jumelle. `motion-safe` la supprime pour qui a demandé moins
          // d'animation.
          className="grid h-10 w-10 place-items-center rounded-full border border-paper/55 transition-transform duration-300 group-hover:translate-y-1 motion-safe:animate-[float_2.4s_ease-in-out_infinite]"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
    </section>
  );
}

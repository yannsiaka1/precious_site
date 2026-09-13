/**
 * Défilement vers une section, de durée bornée.
 *
 * `scroll-behavior: smooth` laisse le navigateur choisir la durée, laquelle
 * croît avec la distance : sur cette page, un aller du pied vers l'académie
 * prenait près de trois secondes. Ici, la durée reste comprise entre 320 et
 * 600 ms quelle que soit la distance parcourue.
 */

const MIN = 320;
const MAX = 600;

/** Accélération puis décélération, sans à-coup au départ ni à l'arrivée. */
function adoucir(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Marge haute, pour que l'en-tête collant ne recouvre pas le titre visé. */
function marge(): number {
  return window.innerWidth >= 1024 ? 96 : 72;
}

export function defilerVers(id: string): void {
  const cible = document.getElementById(id);
  if (!cible) return;

  const depart = window.scrollY;
  const arrivee = Math.max(
    0,
    depart + cible.getBoundingClientRect().top - marge(),
  );
  const distance = arrivee - depart;

  // Respect du réglage système : on saute directement, sans animation.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, arrivee);
    return;
  }

  // Durée proportionnelle à la distance, mais toujours dans les bornes.
  const duree = Math.min(MAX, Math.max(MIN, Math.abs(distance) * 0.22));
  const debut = performance.now();

  function pas(maintenant: number) {
    const avancement = Math.min(1, (maintenant - debut) / duree);
    window.scrollTo(0, depart + distance * adoucir(avancement));
    if (avancement < 1) window.requestAnimationFrame(pas);
  }

  window.requestAnimationFrame(pas);
}

/**
 * Intercepte les clics sur les ancres internes de la page.
 * Posé une seule fois depuis App : chaque lien `href="#section"` passe par le
 * défilement borné, sans qu'aucun composant n'ait à s'en préoccuper.
 */
export function installerDefilementAncres(): () => void {
  function onClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const lien = (event.target as HTMLElement | null)?.closest("a");
    const href = lien?.getAttribute("href");
    if (!href?.startsWith("#") || href.length < 2) return;

    const id = href.slice(1);
    if (!document.getElementById(id)) return;

    event.preventDefault();
    defilerVers(id);
    // L'adresse reste partageable, sans ajouter d'entrée à l'historique.
    history.replaceState(null, "", href);
  }

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

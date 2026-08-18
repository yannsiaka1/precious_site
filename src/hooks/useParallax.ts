import { useEffect, useRef, useState } from "react";

/**
 * Décale légèrement un élément pendant le défilement.
 * Le calcul est fait dans requestAnimationFrame et coupé si la personne a
 * demandé à réduire les animations.
 */
export function useParallax<T extends HTMLElement>(strength = 24) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    function update() {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      // -1 quand l'élément entre par le bas, +1 quand il sort par le haut.
      const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
      setOffset(-progress * strength);
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [strength]);

  return {
    ref,
    style: { transform: `translate3d(0, ${offset.toFixed(1)}px, 0)` },
  };
}

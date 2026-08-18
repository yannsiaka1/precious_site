import { useEffect, useMemo, useState } from "react";
import { navigation, site } from "@/content/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";

/**
 * En-tête collant.
 * - Au repos : fond transparent.
 * - Au défilement : voile translucide + flou, la page reste visible dessous.
 * L'onglet de la section à l'écran reste en rouge, comme sur la maquette.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sectionIds = useMemo(
    () => navigation.map((link) => link.href.replace("#", "")),
    [],
  );
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "bg-paper/55 shadow-[0_1px_0_rgba(23,50,31,0.08)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <div className="page-x flex min-h-24 items-center justify-between gap-6 lg:min-h-32">
        <a
          href="#accueil"
          aria-label={`${site.name} — accueil`}
          className="shrink-0"
        >
          <img
            src="/assets/logo.webp"
            alt={`${site.name} ${site.tagline}`}
            width={201}
            height={159}
            className="h-20 w-auto lg:h-26"
          />
        </a>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-8 font-ui text-base font-bold xl:gap-11">
            {navigation.map((link) => {
              const active = activeId === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative block py-2 transition-colors duration-200",
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brand-red",
                      "after:origin-right after:transition-transform after:duration-300 after:ease-(--ease-out-soft)",
                      "hover:text-brand-red hover:after:origin-left hover:after:scale-x-100",
                      active
                        ? "text-brand-red after:scale-x-100"
                        : "text-ink/85 after:scale-x-0",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <SocialLinks className="hidden sm:flex" />

          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-ink/20 px-4 font-ui text-sm font-bold lg:hidden"
          >
            {open ? "Fermer" : "Menu"}
            <span aria-hidden="true" className="grid gap-1">
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform duration-300",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform duration-300",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="page-x border-t border-ink/10 bg-paper/95 pb-6 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Navigation mobile">
          <ul className="grid font-ui font-bold">
            {navigation.map((link) => (
              <li
                key={link.href}
                className="border-b border-ink/10 last:border-0"
              >
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-4 text-base",
                    activeId === link.href.replace("#", "") && "text-brand-red",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks className="mt-6 sm:hidden" />
      </div>
    </header>
  );
}

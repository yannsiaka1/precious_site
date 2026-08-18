import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const paths: Record<string, string> = {
  Facebook:
    "M12 2C6.48 2 2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12c0-5.52-4.48-10-10-10Z",
  TikTok:
    "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.69a5.68 5.68 0 0 0-.77-.06 5.68 5.68 0 1 0 5.68 5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.24-1.48Z",
  Instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 6.68a3.16 3.16 0 1 0 0 6.32 3.16 3.16 0 0 0 0-6.32Zm0 5.21a2.05 2.05 0 1 1 0-4.1 2.05 2.05 0 0 1 0 4.1Zm4.02-5.33a.74.74 0 1 1-1.48 0 .74.74 0 0 1 1.48 0Z",
};

/**
 * Icônes des réseaux sociaux. Tant qu'un lien n'est pas renseigné dans
 * `site.social`, l'icône reste affichée mais inactive : on voit la place
 * qu'elle occupe sans proposer un lien mort.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-4", className)}>
      {site.social.map((network) => {
        const path = paths[network.label];
        const icon = (
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={path} />
          </svg>
        );

        return (
          <li key={network.label}>
            {network.href ? (
              <a
                href={network.href}
                target="_blank"
                rel="noreferrer"
                aria-label={network.label}
                className="block transition-[color,transform] duration-200 hover:-translate-y-0.5 hover:text-brand-red"
              >
                {icon}
              </a>
            ) : (
              <span
                title={`${network.label} — lien à venir`}
                aria-label={`${network.label} — lien à venir`}
                role="img"
                className="block opacity-35"
              >
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

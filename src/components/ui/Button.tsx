import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "red" | "forest" | "onDark" | "onLight";
type Size = "md" | "lg";

/**
 * Appels à l'action du site : un rectangle fin, dans le même trait que les
 * onglets et les filets des en-têtes. Chaque variante a son propre survol,
 * pour distinguer l'action principale de l'action secondaire.
 */
const variants: Record<Variant, string> = {
  red: "border-ink/45 text-ink hover:border-brand-red hover:bg-brand-red hover:text-paper",
  forest:
    "border-ink/45 text-ink hover:border-forest-deep hover:bg-forest-deep hover:text-mango",
  onDark:
    "border-paper/55 text-paper hover:scale-[1.05] hover:border-paper hover:bg-paper hover:text-forest-deep",
  onLight:
    "border-forest/40 text-forest hover:border-forest hover:bg-forest hover:text-paper",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-6 py-3.5 text-[clamp(0.92rem,1.05vw,1.05rem)] sm:px-7",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "red",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;

  return (
    <Tag
      className={cn(
        "group inline-flex items-center justify-center gap-3 border font-display tracking-[0.06em] uppercase",
        "transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-(--ease-out-soft)",
        "hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(23,50,31,0.14)] active:translate-y-0",
        "motion-reduce:transform-none motion-reduce:transition-colors",
        "disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

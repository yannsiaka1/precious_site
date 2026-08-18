import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "light" | "ghost";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-mango text-ink shadow-[0_12px_28px_rgba(242,169,0,0.25)] hover:shadow-[0_18px_38px_rgba(242,169,0,0.35)]",
  dark: "bg-forest text-paper hover:bg-forest-deep",
  light: "bg-paper text-forest-deep hover:bg-cream",
  ghost:
    "border border-current/25 text-current hover:border-current/60 hover:bg-current/5",
};

const sizes: Record<Size, string> = {
  md: "min-h-13 px-6 text-sm",
  sm: "min-h-11 px-5 text-[0.8125rem]",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Bouton et lien-bouton : une seule apparence, deux balises possibles. */
export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;

  return (
    <Tag
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-full font-ui font-bold tracking-tight",
        "transition-[transform,box-shadow,background-color] duration-200 ease-(--ease-out-soft)",
        "hover:-translate-y-0.5 active:translate-y-0",
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

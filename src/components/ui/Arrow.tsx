/** Flèche des liens et boutons : avance légèrement au survol du parent. */
export function Arrow({
  direction = "right",
}: {
  direction?: "right" | "down" | "up-right";
}) {
  const rotation = { right: 0, down: 90, "up-right": -45 }[direction];

  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 ease-(--ease-out-soft) group-hover:translate-x-0.5"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

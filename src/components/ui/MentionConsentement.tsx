/**
 * Mention de consentement, affichée sous chaque bouton d'envoi.
 *
 * La Loi 25 demande que le consentement soit donné « à des fins spécifiques »
 * et de façon éclairée. Une case à cocher supplémentaire remplirait la lettre
 * du texte mais pas son esprit : elle ajoute un geste, et personne ne la lit.
 * Une phrase courte placée là où le regard se trouve déjà — juste sous le
 * bouton, au moment de cliquer — dit la finalité réelle et renvoie à la
 * politique pour le détail.
 *
 * Le texte vit ici et nulle part ailleurs : les quatre formulaires du site
 * affichent exactement la même chose, et une correction ne peut pas n'en
 * atteindre que trois.
 */
export function MentionConsentement({ className }: { className?: string }) {
  return (
    <p className={className}>
      <span className="text-sm text-ink/65">
        En envoyant ce formulaire, vous acceptez que Precious utilise ces
        renseignements pour vous répondre et préparer votre demande. Ils ne
        sont ni vendus ni transmis à des fins publicitaires.{" "}
        <a
          href="/confidentialite"
          className="underline decoration-mango decoration-2 underline-offset-[5px] hover:text-ink"
        >
          Politique de confidentialité
        </a>
      </span>
    </p>
  );
}

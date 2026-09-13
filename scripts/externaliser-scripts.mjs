/**
 * Sort les scripts en ligne du HTML généré.
 *
 * Pourquoi : la politique de sécurité du contenu (CSP) du site autorise
 * `script-src 'self'`, c'est-à-dire uniquement des fichiers servis par le
 * domaine. Tout `<script>` écrit directement dans la page est donc refusé par
 * le navigateur, qui affiche une erreur dans la console.
 *
 * vite-react-ssg insère un tel script pour exposer son identifiant de build.
 * Plutôt que d'affaiblir la CSP avec `unsafe-inline` — ce qui rouvrirait la
 * porte aux injections de script, la raison d'être de cette règle — on déplace
 * le contenu dans un fichier, exactement ce que recommande le navigateur.
 *
 * Les blocs `application/ld+json` ne sont pas concernés : ils ne sont pas
 * exécutés, le navigateur ne les bloque pas, et les données structurées
 * doivent rester dans la page pour que Google les lise.
 *
 *   node scripts/externaliser-scripts.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DIST = "dist";
const PAGE = join(DIST, "index.html");

let html = await readFile(PAGE, "utf8");

// <script> sans attribut src et sans type "application/ld+json"
const motif = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

let sortis = 0;
const remplacements = [];

for (const found of html.matchAll(motif)) {
  const code = found[1]?.trim();
  if (!code) continue;

  // Nom de fichier dérivé du contenu : il change avec le code, ce qui évite
  // qu'un navigateur serve une version périmée depuis son cache.
  const empreinte = createHash("sha256").update(code).digest("hex").slice(0, 10);
  const fichier = `assets/inline-${empreinte}.js`;

  await writeFile(join(DIST, fichier), `${code}\n`, "utf8");
  remplacements.push([found[0], `<script src="/${fichier}"></script>`]);
  sortis += 1;
}

for (const [avant, apres] of remplacements) {
  html = html.replace(avant, apres);
}

await writeFile(PAGE, html, "utf8");

console.log(
  sortis === 0
    ? "Aucun script en ligne à sortir."
    : `${sortis} script(s) en ligne déplacé(s) vers un fichier.`,
);

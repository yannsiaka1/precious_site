/**
 * Fabrique un aperçu autonome à partir du build réel.
 *
 * Lit dist/, met en ligne le CSS, le JS et les images (en base64) dans un
 * unique fichier HTML. L'aperçu est donc généré depuis le vrai code : ce qu'il
 * montre est exactement ce que produit `npm run build`, interactivité comprise.
 *
 *   node scripts/make-preview.mjs [chemin/de/sortie.html]
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const DIST = "dist";
const OUT = process.argv[2] ?? "preview.html";

const MIME = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

/** Liste récursive des fichiers d'un dossier, chemins relatifs à DIST. */
async function walk(dir) {
  const entries = await readdir(join(DIST, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

const assets = [...(await walk("assets")), ...(await walk("fonts"))];

/** Remplace /assets/xxx par une URL de données, dans du HTML ou du CSS. */
async function inlineAssets(source) {
  let output = source;
  for (const file of assets) {
    const ext = extname(file);
    const mime = MIME[ext];
    if (!mime) continue;
    if (!output.includes(basename(file))) continue;
    const data = await readFile(join(DIST, file));
    const url = `data:${mime};base64,${data.toString("base64")}`;
    // Remplacement par fonction : le contenu inséré contient des `$` que
    // String.replace interpréterait comme des motifs ($&, $`, $').
    output = output.replaceAll(new RegExp(`(\\.?/)?${file}`, "g"), () => url);
  }
  return output;
}

let html = await readFile(join(DIST, "index.html"), "utf8");

// 1. Feuille de style
const cssFile = assets.find((file) => file.endsWith(".css"));
const css = await inlineAssets(await readFile(join(DIST, cssFile), "utf8"));
html = html.replace(
  new RegExp(`<link rel="stylesheet"[^>]*${cssFile}"[^>]*>`),
  () => `<style>${css}</style>`,
);

// 2. Modules JavaScript : chaque module devient une URL de données, et les
//    specifiers d'import sont réécrits pour pointer dessus. On préserve ainsi
//    la sémantique des modules ES au lieu de les concaténer à plat.
const entry = assets.find((file) => basename(file).startsWith("app-"));
const jsFiles = assets.filter((file) => file.endsWith(".js"));
if (jsFiles.length > 1) {
  throw new Error(
    `Le build doit produire un seul fichier JS (lancer avec PREVIEW=1). Trouvé : ${jsFiles.join(", ")}`,
  );
}

const script = await inlineAssets(await readFile(join(DIST, entry), "utf8"));

html = html.replace(
  new RegExp(`<script type="module"[^>]*${basename(entry)}"[^>]*></script>`),
  "",
);
html = html.replace(
  "</body>",
  () => `<script type="module">${script}</script></body>`,
);

// 3. Images restantes référencées dans le HTML prérendu
html = await inlineAssets(html);
html = html.replace(/<link rel="(icon|preload)"[^>]*>/g, "");

await writeFile(OUT, html);
console.log(`${OUT} — ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} Mo`);

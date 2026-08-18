import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    // Le site est une page unique : on garde un seul bundle, plus simple à mettre en cache.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // PREVIEW=1 : tout le JavaScript dans un seul fichier, ce dont
        // scripts/make-preview.mjs a besoin pour produire un HTML autonome.
        ...(process.env["PREVIEW"] ? { inlineDynamicImports: true } : {}),
      },
    },
  },
});

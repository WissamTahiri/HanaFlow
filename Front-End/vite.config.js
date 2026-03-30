import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
// eslint-disable-next-line no-unused-vars
/// <reference types="vitest" />

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
      "@config": fileURLToPath(new URL("./src/config", import.meta.url)),
    },
  },

  server: {
    port: 5173,
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.js",
    css: false,
  },

  build: {
    sourcemap: false,
    // Avertit si un chunk dépasse 500 kB
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Librairies React core → un seul chunk vendor stable
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
            return "vendor-react";
          }
          // Librairie d'animation → chunk séparé (lourd)
          if (id.includes("node_modules/motion") || id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          // @react-pdf/renderer isolé — dépendances circulaires internes connues
          if (id.includes("node_modules/@react-pdf")) {
            return "vendor-pdf";
          }
          // Laisser Rollup gérer le reste automatiquement (évite les circular deps)
        },
      },
    },
  },
});

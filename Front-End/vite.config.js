import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

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
          // Autres dépendances npm → vendor générique
          if (id.includes("node_modules")) {
            return "vendor";
          }
          // Pages SAP lourdes → un chunk chargé uniquement si l'utilisateur navigue vers ces pages
          if (/\/pages\/(FI|CO|MM|SD|HCM|PP)\.jsx/.test(id)) {
            return "sap-modules";
          }
        },
      },
    },
  },
});

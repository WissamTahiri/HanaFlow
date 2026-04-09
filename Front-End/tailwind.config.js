/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // --- Couleurs primaires SAP (Corporate Trust palette) ---
        sapBlue:      "#2563EB",
        sapBlueDark:  "#1D4ED8",
        sapGrayLight: "#F8FAFC",

        // --- Tokens sombres ---
        sapDark:  "#0F172A",   // fond sombre (slate-900)
        sapCard:  "#1E293B",   // carte sombre (slate-800)
        sapMuted: "#64748B",   // texte secondaire (slate-500)

        // --- Accent orange (CTA / highlight) ---
        sapAccent:     "#F97316",  // orange-500
        sapAccentDark: "#EA580C",  // orange-600

        // --- Sémantiques ---
        sapSuccess:    "#10B981",  // emerald-500
        sapWarning:    "#F59E0B",  // amber-500
        sapError:      "#EF4444",  // red-500

        // --- Palette complète avec nuances ---
        sap: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#2563EB",  // primary
          600: "#1D4ED8",  // dark
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554",
        },
      },

      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        sans:    ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono:    ["Fira Code", "Roboto Mono", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      boxShadow: {
        soft:   "0 4px 24px rgba(37, 99, 235, 0.10)",
        medium: "0 8px 32px rgba(37, 99, 235, 0.14)",
        large:  "0 16px 48px rgba(37, 99, 235, 0.20)",
        card:   "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      animation: {
        "fade-in":   "fadeIn 0.4s ease forwards",
        "slide-up":  "slideUp 0.4s ease forwards",
        "slide-down":"slideDown 0.25s ease forwards",
        "scale-in":  "scaleIn 0.2s ease forwards",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },

      transitionDuration: {
        150: "150ms",
        300: "300ms",
        500: "500ms",
      },

      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
        "card-gradient": "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)",
      },
    },
  },
  plugins: [],
};

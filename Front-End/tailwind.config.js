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
        // --- Couleurs primaires SAP (rétrocompatibilité) ---
        sapBlue:      "#0F52BA",
        sapBlueDark:  "#0B3C87",
        sapGrayLight: "#F3F4F6",

        // --- Tokens manquants (fix LoginPage/RegisterPage) ---
        sapDark:  "#0F172A",   // fond sombre (slate-950)
        sapCard:  "#1E293B",   // carte sombre (slate-800)
        sapMuted: "#64748B",   // texte secondaire (slate-500)

        // --- Palette étendue ---
        sapAccent:     "#0EA5E9",  // sky-500 — accent/highlight
        sapAccentDark: "#0284C7",  // sky-600
        sapSuccess:    "#10B981",  // emerald-500
        sapWarning:    "#F59E0B",  // amber-500
        sapError:      "#EF4444",  // red-500

        // --- Palette complète avec nuances ---
        sap: {
          50:  "#EBF2FF",
          100: "#D6E6FF",
          200: "#ADC8FF",
          300: "#84AAFF",
          400: "#5B8BFF",
          500: "#0F52BA",  // primary
          600: "#0B3C87",  // dark
          700: "#082C61",
          800: "#051D40",
          900: "#020F21",
        },
      },

      fontFamily: {
        display: ["Clash Display", "system-ui", "sans-serif"],
        sans:    ["Satoshi", "system-ui", "sans-serif"],
        mono:    ["Fira Code", "Roboto Mono", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      boxShadow: {
        soft:   "0 4px 24px rgba(15, 82, 186, 0.12)",
        medium: "0 8px 32px rgba(15, 82, 186, 0.18)",
        large:  "0 16px 48px rgba(15, 82, 186, 0.24)",
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
        "hero-gradient": "linear-gradient(135deg, #0B3C87 0%, #0F52BA 50%, #0EA5E9 100%)",
        "card-gradient": "linear-gradient(135deg, #EBF2FF 0%, #F8FAFF 100%)",
      },
    },
  },
  plugins: [],
};

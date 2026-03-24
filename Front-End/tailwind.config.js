/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sapBlue: "#0F52BA",
        sapBlueDark: "#0B3C87",
        sapGrayLight: "#F3F4F6"
      },
      fontFamily: {
        sans: ["system-ui", "Inter", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 82, 186, 0.15)"
      }
    }
  },
  plugins: []
};

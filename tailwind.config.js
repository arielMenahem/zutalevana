/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        charcoal: "#1C1C1E",
        slate: {
          750: "#2D3748",
          850: "#1A202C",
          950: "#0D1117",
        },
      },
      fontFamily: {
        serif: ["Frank Ruhl Libre", "serif"],
        sans: ["Assistant", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1C1C1E 0%, #2D3748 50%, #1A1A2E 100%)",
      },
      animation: {
        "float-slow": "floatY 6s ease-in-out infinite",
        "float-medium": "floatY 4s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

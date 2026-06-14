/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f2f8f4",
          100: "#e0f0e5",
          200: "#b8dcc3",
          300: "#7fc09a",
          400: "#4da372",
          500: "#2e7d32",
          600: "#276b2b",
          700: "#1f5723",
          800: "#17431b",
          900: "#0e2e11",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
// Huisstijl afgestemd op JONES advocaten (olijf, vanille, roest; Fraunces + Jost)
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#F3ECD9", 100: "#E9E4CC", 200: "#D3D2B0", 300: "#A8AD82", 400: "#7A8450",
          500: "#4D5A3A", 600: "#434F33", 700: "#333D24", 800: "#2A321D", 900: "#1F2515",
        },
        emerald: {
          50: "#F3ECD9", 100: "#E9E4CC", 200: "#D3D2B0", 300: "#A8AD82", 400: "#7A8450",
          500: "#4D5A3A", 600: "#434F33", 700: "#333D24", 800: "#2A321D", 900: "#1F2515",
        },
        primary: {
          50:  "#F3ECD9",
          100: "#E9E4CC",
          200: "#D3D2B0",
          300: "#A8AD82",
          400: "#7A8450",
          500: "#4D5A3A",
          600: "#434F33",
          700: "#333D24",
          800: "#2A321D",
          900: "#1F2515",
        },
        rust: { 400: "#B8714C", 500: "#A15C38", 600: "#7C4429" },
        white: "#FBF3DE",
        gray: {
          50:  "#F3ECD9",
          100: "#ECE4CE",
          200: "#DED5BD",
          300: "#C9BFA5",
          400: "#9C957F",
          500: "#6F6A5A",
          600: "#55513F",
          700: "#403D30",
          800: "#302E24",
          900: "#2B2A22",
        },
      },
      fontFamily: {
        sans: ["Jost", "Segoe UI", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

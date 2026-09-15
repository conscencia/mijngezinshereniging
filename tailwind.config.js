/** @type {import('tailwindcss').Config} */
// Huisstijl afgestemd op JONES advocaten (olijf, vanille, roest; Poppins)
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#F3ECD9", 100: "#E9E4CC", 200: "#D3D2B0", 300: "#A8AD82", 400: "#7A8450",
          500: "#4D5A3A", 600: "#434F33", 700: "#333D24", 800: "#2A321D", 900: "#1F2515",
        },
        blue: {
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
      boxShadow: {
        sm: "0 1px 2px rgba(43,42,34,0.05), 0 4px 14px rgba(43,42,34,0.06)",
        DEFAULT: "0 1px 2px rgba(43,42,34,0.05), 0 4px 14px rgba(43,42,34,0.06)",
        md: "0 2px 4px rgba(43,42,34,0.05), 0 12px 32px rgba(43,42,34,0.10)",
        lg: "0 4px 8px rgba(20,24,12,0.10), 0 24px 60px rgba(20,24,12,0.18)",
        xl: "0 4px 8px rgba(20,24,12,0.10), 0 24px 60px rgba(20,24,12,0.18)",
      },
      borderRadius: { lg: "12px", xl: "14px", "2xl": "16px" },
      fontFamily: {
        sans: ["Poppins", "Segoe UI", "sans-serif"],
        serif: ["Poppins", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

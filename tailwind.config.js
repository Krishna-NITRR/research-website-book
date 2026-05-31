/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#6C4CF1",
          dark: "#5538d4",
          light: "rgba(108,76,241,0.08)",
        },
        orange: "#FF6800",
        bg: "#F8F8F8",
        text: "#1A1A1A",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
        dmsans: ["DMSans"],
      },
    },
  },
  plugins: [],
};
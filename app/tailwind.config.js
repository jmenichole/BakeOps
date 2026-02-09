/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        primary: "#FF7EB3",
        "primary-hover": "#FF5C9D",
        secondary: "#3C2F2F",
        accent: "#FFD700",
        background: "#FFF9F9",
      },
    },
  },
  plugins: [],
};

/**
 * BOT (Baked On Time) - Tailwind CSS Configuration
 * 
 * Copyright (c) 2025 BOT (Baked On Time)
 * Licensed under the MIT License
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Primary - Soft Blush Pink (Cake tone)
        primary: {
          DEFAULT: '#ffa8ba',
          foreground: '#2d2926',
          50: '#fff5f7',
          100: '#ffe3e8',
          200: '#ffcdd6',
          300: '#ffaab9',
          400: '#ff7a93',
          500: '#ff5079',
          600: '#e11d5f',
          700: '#c21149',
          800: '#a0103d',
          900: '#831036',
        },
        // Accent - Rose Gold & Metallic Gold
        accent: {
          DEFAULT: '#d4a574',
          foreground: '#2d2926',
          gold: '#d4a574',
          'rose-gold': '#e8b4a0',
          light: '#f5d5c3',
        },
        // Neutral - Warm Grey/Charcoal
        neutral: {
          DEFAULT: '#7d7976',
          50: '#f8f6f4',
          100: '#edeae7',
          200: '#ddd9d6',
          300: '#bdb9b6',
          400: '#9d9996',
          500: '#7d7976',
          600: '#5d5956',
          700: '#3d3936',
          800: '#2d2926',
          900: '#1d1916',
        },
        // Highlight - Coral for CTAs
        coral: {
          DEFAULT: '#ff6b6b',
          dark: '#ee5a52',
          light: '#ff8787',
        },
        // Alternative highlight - Teal
        teal: {
          DEFAULT: '#20c997',
          dark: '#19a579',
          light: '#3dd6ad',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

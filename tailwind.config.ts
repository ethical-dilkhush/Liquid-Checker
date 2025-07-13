import type { Config } from "tailwindcss"
import { colors } from "./lib/colors"

const config: Config = {
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
        ...colors,
        border: colors.accent.dark,
        ring: colors.accent.dark,
        input: colors.surface.dark,
        background: colors.background.DEFAULT,
        foreground: colors.text.primary,
        primary: {
          ...colors.primary,
          foreground: colors.surface.light,
        },
        secondary: {
          ...colors.secondary,
          foreground: colors.surface.light,
        },
        accent: {
          ...colors.accent,
          foreground: colors.surface.light,
        },
        muted: {
          DEFAULT: colors.surface.dark,
          foreground: colors.text.muted,
        },
        card: {
          DEFAULT: colors.surface.light,
          foreground: colors.text.primary,
        },
      },
      backgroundImage: {
        'gradient-primary': colors.gradients.primary,
        'gradient-secondary': colors.gradients.secondary,
        'gradient-accent': colors.gradients.accent,
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

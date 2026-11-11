import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF7",
        foreground: "#2B2350",
        primary: {
          DEFAULT: "#6C4DFF",
          dark: "#5A3DEB",
        },
        secondary: {
          DEFAULT: "#C9CCFF",
          dark: "#B4B8FA",
        },
        accent: {
          DEFAULT: "#FF4D5E",
          hover: "#E83A4B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#F4F2FF",
        },
        sheet: {
          periwinkle: "#C9CCFF",
          lemon: "#FFF3A3",
          coral: "#FFB5A7",
          mint: "#B8F0D2",
          sky: "#BFE6FF",
          white: "#FFFFFF",
        },
        ink: {
          plum: "#2B2350",
          secondary: "#6B6590",
        },
      },
      fontFamily: {
        heading: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
        handwriting: ["'Caveat'", "cursive"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 0.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

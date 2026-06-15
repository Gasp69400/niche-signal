import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050508",
        foreground: "#ffffff",
        muted: "#6B7280",
        accent: {
          blue: "#3B82F6",
          "blue-dark": "#2563EB",
          sky: "#38BDF8",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.04)",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.3)",
        "glow-sm": "0 0 20px rgba(59, 130, 246, 0.35)",
        "glow-sky": "0 0 30px rgba(56, 189, 248, 0.25)",
        "glow-lg": "0 0 60px rgba(59, 130, 246, 0.4)",
        card: "0 8px 32px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        levitate: "levitate 4s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
        "blob-delayed": "blob 12s ease-in-out 4s infinite",
        shimmer: "shimmer 3s linear infinite",
        "shimmer-slide": "shimmerSlide 2.5s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        levitate: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        shimmerSlide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

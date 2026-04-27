/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cabinet Grotesk'", "'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg:     { DEFAULT: "#050510", 2: "#0a0a1e", 3: "#0f0f28" },
        violet: { DEFAULT: "#6d28d9", 2: "#8b5cf6", 3: "#a78bfa", 4: "#c4b5fd" },
        cyan:   { DEFAULT: "#0891b2", 2: "#06b6d4", 3: "#22d3ee", 4: "#67e8f9" },
        rose:   { DEFAULT: "#e11d48", 2: "#f43f5e" },
      },
      backdropBlur: { glass: "24px" },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      animation: {
        "glow-v":  "glowV 3s ease infinite",
        "glow-c":  "glowC 3s ease infinite",
        "glow-g":  "glowG 3s ease infinite",
        "float":   "float 4s ease-in-out infinite",
        "ping-sm": "pingSm 1.5s ease-out infinite",
        "bounce-in":"bounceIn 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up": "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-r": "slideR 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "spin-s":  "spin 0.75s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        glowV:    { "0%,100%": { boxShadow: "0 0 16px rgba(109,40,217,0.4)" }, "50%": { boxShadow: "0 0 40px rgba(109,40,217,0.7), 0 0 80px rgba(109,40,217,0.2)" } },
        glowC:    { "0%,100%": { boxShadow: "0 0 16px rgba(8,145,178,0.4)"  }, "50%": { boxShadow: "0 0 40px rgba(8,145,178,0.7),  0 0 80px rgba(8,145,178,0.2)"  } },
        glowG:    { "0%,100%": { boxShadow: "0 0 16px rgba(34,197,94,0.4)"  }, "50%": { boxShadow: "0 0 40px rgba(34,197,94,0.7),  0 0 80px rgba(34,197,94,0.2)"  } },
        float:    { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        pingSm:   { "0%": { transform: "scale(1)", opacity: "1" }, "75%,100%": { transform: "scale(1.8)", opacity: "0" } },
        bounceIn: { "0%": { transform: "scale(0.88) translateY(12px)", opacity: "0" }, "60%": { transform: "scale(1.03)" }, "100%": { transform: "scale(1) translateY(0)", opacity: "1" } },
        fadeUp:   { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideR:   { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer:  { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      boxShadow: {
        "v-sm": "0 2px 12px rgba(109,40,217,0.3)",
        "v-md": "0 4px 24px rgba(109,40,217,0.4)",
        "v-lg": "0 8px 48px rgba(109,40,217,0.5)",
        "c-sm": "0 2px 12px rgba(8,145,178,0.3)",
        "c-md": "0 4px 24px rgba(8,145,178,0.4)",
        "card": "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        "inset-v": "inset 0 1px 0 rgba(139,92,246,0.3)",
      },
    },
  },
  plugins: [],
};

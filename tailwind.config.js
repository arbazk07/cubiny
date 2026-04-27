/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm:   ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: { DEFAULT: "#06060f", 2: "#0d0d1f", 3: "#12122a" },
        violet: { DEFAULT: "#7c3aed", 2: "#a855f7", 3: "#c084fc" },
        cyan:   { DEFAULT: "#06b6d4", 2: "#22d3ee", 3: "#67e8f9" },
      },
      backdropBlur: { glass: "20px" },
      animation: {
        "pulse-slow":  "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow-green":  "glowGreen 2s ease infinite",
        "glow-violet": "glowViolet 2s ease infinite",
        "bounce-in":   "bounceIn 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up":     "fadeUp 0.35s ease both",
        "slide-in":    "slideIn 0.3s ease both",
        spin:          "spin 0.7s linear infinite",
      },
      keyframes: {
        glowGreen:  { "0%,100%": { boxShadow: "0 0 12px #22c55e" }, "50%": { boxShadow: "0 0 28px #22c55e,0 0 50px rgba(34,197,94,0.3)" } },
        glowViolet: { "0%,100%": { boxShadow: "0 0 12px #a855f7" }, "50%": { boxShadow: "0 0 28px #a855f7,0 0 50px rgba(168,85,247,0.3)" } },
        bounceIn:   { "0%": { transform: "scale(0.85)", opacity: "0" }, "60%": { transform: "scale(1.05)" }, "100%": { transform: "scale(1)", opacity: "1" } },
        fadeUp:     { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn:    { from: { opacity: "0", transform: "translateX(-12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
      },
      boxShadow: {
        violet: "0 4px 24px rgba(124,58,237,0.35)",
        cyan:   "0 4px 24px rgba(6,182,212,0.3)",
        card:   "0 8px 32px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

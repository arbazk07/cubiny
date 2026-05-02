// tailwind.config.js — Cubiny v5
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blu:  "#3b82f6",
          blu2: "#60a5fa",
          v:    "#7c3aed",
          v2:   "#8b5cf6",
          grn:  "#10b981",
          grn2: "#34d399",
        },
      },
      boxShadow: {
        "v-md":  "0 4px 16px rgba(124,62,237,0.35)",
        "v-lg":  "0 8px 32px rgba(124,62,237,0.5)",
        "blu-md":"0 4px 16px rgba(59,130,246,0.35)",
        "blu-lg":"0 8px 32px rgba(59,130,246,0.5)",
        "c-md":  "0 4px 16px rgba(8,145,178,0.35)",
        "c-lg":  "0 8px 32px rgba(8,145,178,0.5)",
        "grn-md":"0 4px 16px rgba(16,185,129,0.35)",
        "grn-lg":"0 8px 32px rgba(16,185,129,0.5)",
      },
      borderRadius: {
        "r1":"10px", "r2":"14px", "r3":"20px", "r4":"28px",
      },
      fontFamily: {
        display:["Syne","sans-serif"],
        body:   ["Plus Jakarta Sans","sans-serif"],
        mono:   ["JetBrains Mono","monospace"],
      },
      keyframes: {
        "spin-s":    { to:{ transform:"rotate(360deg)" } },
        "fade-up":   { from:{ opacity:0, transform:"translateY(12px)" }, to:{ opacity:1, transform:"translateY(0)" } },
        "bounce-in": { "0%":{ opacity:0, transform:"scale(0.9)" }, "60%":{ transform:"scale(1.03)" }, "100%":{ opacity:1, transform:"scale(1)" } },
        shimmer:     { "0%":{ backgroundPosition:"200% 0" }, "100%":{ backgroundPosition:"-200% 0" } },
      },
      animation: {
        "spin-s":   "spin-s 0.8s linear infinite",
        "fade-up":  "fade-up 0.35s ease both",
        "bounce-in":"bounce-in 0.4s ease both",
        shimmer:    "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

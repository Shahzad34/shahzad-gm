/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#00f3ff",
        "neon-purple": "#bc13fe",
      },
      fontFamily: {
        display: ["Orbitron", "Rajdhani", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        floatChar: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-14px) scale(1.015)" },
        },
        floatBadge: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.3, transform: "scale(0.85)" },
          "50%": { opacity: 1, transform: "scale(1.15)" },
        },
        ringSpinCyan: {
          from: { transform: "rotate(-16deg)" },
          to: { transform: "rotate(344deg)" },
        },
        ringSpinPurple: {
          from: { transform: "rotate(370deg)" },
          to: { transform: "rotate(10deg)" },
        },
        moveDot: {
          "0%": { left: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        vipGlow: {
          "0%, 100%": { opacity: "0.85", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.35)" },
        },
        bgPulse: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        floatChar: "floatChar 4.5s ease-in-out infinite",
        floatBadge: "floatBadge 3.6s ease-in-out infinite",
        twinkle: "twinkle 3.2s ease-in-out infinite",
        ringSpinCyan: "ringSpinCyan 14s linear infinite",
        ringSpinPurple: "ringSpinPurple 18s linear infinite",
        moveDot: "moveDot 3s linear infinite",
        vipGlow: "vipGlow 2.6s ease-in-out infinite",
        bgPulse: "bgPulse 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

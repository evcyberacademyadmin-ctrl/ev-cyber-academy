/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0B0F19",
          card: "#111827",
          border: "#1F2937",
          hover: "#1E293B",
          cyan: "#06B6D4",
          "cyan-bright": "#22D3EE",
          blue: "#3B82F6",
          indigo: "#6366F1",
          gold: "#F59E0B",
          emerald: "#10B981"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.3)'
      }
    },
  },
  plugins: [],
}

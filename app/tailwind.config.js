/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        dmSans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#0d0f14',
        surface: '#14171f',
        card: '#1a1e28',
        border: '#252a38',
        accent: '#2563EB',
        accent2: '#38bdf8',
        gold: '#f59e0b',
        muted: '#6b7280',
        success: '#10b981',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}

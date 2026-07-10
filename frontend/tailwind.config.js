/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support toggle dark mode if needed
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fe',
          100: '#e9edfc',
          200: '#d7dffb',
          300: '#b9c7f7',
          400: '#94a5f2',
          500: '#637bff', // Vibrant Primary Indigo
          600: '#4f5eeb',
          700: '#404bd7',
          800: '#363fae',
          900: '#2f378b',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Sleek dark slate
          950: '#020617', // High-contrast dark
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

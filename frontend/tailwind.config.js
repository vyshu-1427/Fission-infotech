/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fx: {
          bg0:    '#09090B',
          bg1:    '#111827',
          bg2:    '#0F172A',
          blue:   '#3B82F6',
          cyan:   '#06B6D4',
          purple: '#8B5CF6',
          pink:   '#EC4899',
          border: 'rgba(255,255,255,0.08)',
        },
        brand: {
          50: '#f4f6fe',
          100: '#e9edfc',
          200: '#d7dffb',
          300: '#b9c7f7',
          400: '#94a5f2',
          500: '#637bff',
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
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      borderRadius: { xl2: '20px', xl3: '24px', xl4: '28px' },
      backdropBlur: { xs: '4px', '4xl': '72px' },
      animation: {
        'fade-slide-up': 'fadeSlideUp .6s ease both',
        'float':         'floatY 5s ease-in-out infinite',
        'spin-slow':     'spin360 12s linear infinite',
        'gradient':      'gradientShift 4s linear infinite',
        'neon-pulse':    'neonPulse 2s ease-in-out infinite',
        'blob':          'blobFloat 18s ease-in-out infinite',
        'pulse-ring':    'pulseRing 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

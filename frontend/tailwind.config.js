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

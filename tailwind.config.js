/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      },
      colors: {
        graphite: '#07111f',
        panel: '#0b1728',
        panel2: '#101e33',
        belcyan: '#2dd4ff',
        belamber: '#f6b73c',
        belgreen: '#4ade80',
        belred: '#fb7185'
      },
      boxShadow: {
        glow: '0 0 32px rgba(45,212,255,0.18)',
        amberglow: '0 0 30px rgba(246,183,60,0.18)'
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at top right, rgba(45,212,255,0.16), transparent 28%), radial-gradient(circle at bottom left, rgba(246,183,60,0.10), transparent 24%)'
      }
    }
  },
  plugins: []
};

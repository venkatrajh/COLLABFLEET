/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#111827',
          800: '#161F33',
          700: '#1E2B47',
          600: '#2A3B5F',
        },
        brand: {
          cyan: '#00F2FE',
          blue: '#4FACFE',
          accent: '#0EA5E9',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-glow': '0 0 25px rgba(0, 242, 254, 0.25)',
        'card-glow': '0 4px 20px -2px rgba(14, 165, 233, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

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
          50: '#F0F6FF',
          100: '#E0EDFF',
          200: '#C8DEFF',
          300: '#99C2FF',
          400: '#5297FF',
          500: '#0D5FF9', // Core Royal Blue
          600: '#0246D9',
          700: '#0135AB',
          800: '#0F2B5A', // Core Dark Navy
          900: '#0B1E40',
        },
      },
      fontFamily: {
        sans: ['Urbanist', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

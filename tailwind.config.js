/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light mode colors (default)
        'bg': {
          DEFAULT: 'hsl(210 30% 95%)',
          dark: 'hsl(210 30% 10%)'
        },
        'accent': {
          DEFAULT: 'hsl(170 70% 50%)',
          dark: 'hsl(170 70% 40%)'
        },
        'primary': {
          DEFAULT: 'hsl(210 40% 35%)',
          dark: 'hsl(210 40% 80%)'
        },
        'surface': {
          DEFAULT: 'hsl(210 30% 100%)',
          dark: 'hsl(210 30% 15%)'
        },
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        'card-dark': '0 4px 12px hsla(0, 0%, 0%, 0.3)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}

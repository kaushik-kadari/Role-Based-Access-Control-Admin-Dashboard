/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1abc9c',
          dark: '#16a085',

        },
        dark: {
          background: '#1a202c',
          foreground: '#e2e8f0',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to bottom, #ffffff, #fef7e6)',
        'secondary-gradient': 'linear-gradient(to bottom, #ffffff, #fef3c7)',
        'primary-light': '#f4dda8',
      },
    },
  },
  plugins: [],
}


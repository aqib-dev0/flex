/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ee',
          100: '#cce1dc',
          200: '#99c3b9',
          300: '#66a597',
          400: '#338774',
          500: '#006851', // The dark green from the image
          600: '#005a49',
          700: '#004b3d',
          800: '#003d32',
          900: '#002e26',
          950: '#001f1a',
        },
        secondary: {
          50: '#faf8f3', // Beige/cream background from image
          100: '#f5f1e5',
          200: '#ebe3cc',
          300: '#e0d5b2',
          400: '#d6c799',
          500: '#ccb980',
          600: '#b8a773',
          700: '#968b5f',
          800: '#776f4c',
          900: '#595339',
          950: '#3c3826',
        },
        flex: {
          green: '#006851', // Dark green from the header
          beige: '#faf8f3', // Beige/cream background
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};

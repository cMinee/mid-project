/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-dark': '#183a37',
        'primary-light': '#77C7BF',
        'secondary-dark': '#c44900',
        'tertiary': '#efd6ac',
        'quaternary': '#f5f5f5',
      }
    },
  },
  plugins: [],
}


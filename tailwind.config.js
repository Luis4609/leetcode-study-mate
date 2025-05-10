/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example: using Inter font
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // If you want to style form elements nicely
  ],
}
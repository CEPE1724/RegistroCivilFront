/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx, html}",
      "./node_modules/tw-elements-react/dist/js/**/*.js"
    ],
    darkMode: 'class', 
    theme: {
      extend: {
        colors: {
          morado: '#2d3689',
          moradoHover: '#212863',
          naranja: '#eb2a1b',
          naranjaHover: '#c4110b',
          gris: '#f2f2f2',
        },
      },
    },
    plugins: [],
  }
  
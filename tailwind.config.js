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
        lightGrey: '#D3D3D3', // Set the color value you want
        gris: '#f2f2f2',
        corporateBlue: '#063970',
        corporateBlueLight: '#E0ECF9',
        primaryBlue: "#2D3689",
        primaryBlack: "#1C1C1C",
        primaryBrown: "#CC8729",
        primaryOrange: "#F05A28",
        primaryPurple: "#7129CC",
        fontHeading: "#141516",
        fontBody: "#818181",
        fontExtra: "#CCCCCC",
        fontDisabled: "#E6E6E6",
        fontWhite: "#FFFFFF",
        otherOrange: "#F05A28",
        otherPurple: "#D4B3FF",
        otherImage: "#E7E7E7",
        error: "#FA3434",
        success: "#00B517",
      },
    },
  },
  plugins: [],
}

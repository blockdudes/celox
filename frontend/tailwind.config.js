/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#FACC15",
      "primary-dark": "#DBB314",
      secondary: "#292524",
      background: "#0A0A0A",
      "primary-text": "#FFFFFF",
      "secondary-text": "#000000",
      "tertiary-text": "#A0A0A0",
    },
  },
  plugins: [],
});

import { colors } from './src/styles/colors'
import { fontFamily } from './src/styles/fontFamily'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/app/**/*.{js,jsx,ts,tsx}", "./src/styles/**/*.{js,jsx,ts,tsx}", "./src/**/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily
    },
  },
  plugins: [],
};
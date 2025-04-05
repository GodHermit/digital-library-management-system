import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // size
      height: {
        screen: ['100vh', '100svh'],
      },
      screens: {
        print: { raw: 'print' },
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui(), require('@tailwindcss/typography')],
};

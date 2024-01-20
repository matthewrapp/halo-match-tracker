/** @type {import('tailwindcss').Config} */
// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
   content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./lib/**/*.{js,ts,jsx,tsx}",
      "./lib/common/**/*.{js,ts,jsx,tsx}",
      "./lib/features/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      // material ui add
      "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
   ],
   darkMode: "class",
   theme: {
      fontFamily: {
         sans: ["Roboto", "sans-serif"],
         serif: ["Roboto Slab", "serif"],
         body: ["Roboto", "sans-serif"],
      },
   },
   // next ui add
   // plugins: [nextui()],
});

// /** @type {import('tailwindcss').Config} */
// // tailwind.config.js
// import { nextui } from '@nextui-org/react';
// const defaultTheme = require('tailwindcss/defaultTheme');

// module.exports = {
//    content: [
//       './app/**/*.{js,ts,jsx,tsx}',
//       './pages/**/*.{js,ts,jsx,tsx}',
//       './components/**/*.{js,ts,jsx,tsx}',
//       './features/components/**/*.{js,ts,jsx,tsx}',
//       './common/components/**/*.{js,ts,jsx,tsx}',
//       './lib/**/*.{js,ts,jsx,tsx}',
//       // next ui add
//       './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
//    ],
//    darkMode: 'class',
//    theme: {
//       screens: {
//          xs: '340px',
//          sm: '480px',
//          md: '768px',
//          lg: '976px',
//          xl: '1180px',
//          '2xl': '1440px',
//       },
//       fontFamily: {
//          sans: ['Poppins', ...defaultTheme.fontFamily.sans],
//          serif: ['Merriweather', 'serif'],
//       },
//       extend: {
//          colors: {
//             stone: {
//                850: '#242020',
//             },
//          },
//       },
//    },
//    // next ui add
//    plugins: [nextui()],
// };

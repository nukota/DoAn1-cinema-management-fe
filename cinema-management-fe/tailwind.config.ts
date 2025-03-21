import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      height: {
        '70': '70px',
        '46': '46px',
      },
      width: {
        '184': '184px',
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      space: {
        '22': '22px',
      },
      colors: {
        "line-gray": "#484848",
        "dark-gray": "#101010",
        "light-gray": "#DADADA",
        "gray": "#666",
        "red": "#B80007",
        "dark-red": "#7A0005",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '14px': '14px',
        '10px': '10px',
        '40px': '40px',
      },
      screens: {
        '1270-break-point': '1270px', // Custom breakpoint
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require("tailwind-scrollbar-hide"),
  ],
};

export default config;
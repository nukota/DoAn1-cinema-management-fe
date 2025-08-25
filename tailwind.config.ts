import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 640,
  //     md: 768,
  //     lg: 1024,
  //     xl: 1280,
  //     "2xl": 1536,
  //     "1270-break-point": 1270,
  //   },
  // },
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
        xs: "0px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1560px",
        "1270-break-point": "1270px", // Custom breakpoint
      },
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require("tailwind-scrollbar-hide"),
    require('@tailwindcss/line-clamp'),
  ],
};

export default config;
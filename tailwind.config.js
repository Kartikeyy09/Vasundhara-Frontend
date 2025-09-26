/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    container: {
      center: true, // container ko center karega
      padding: {
        DEFAULT: "1rem", // sabhi screen ke liye by default
        sm: "2rem",      // sm aur upar
        md: "3rem",      // md aur upar
        lg: "4rem",      // lg aur upar
        xl: "5rem",      // xl aur upar
        "2xl": "6rem",   // 2xl aur upar
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

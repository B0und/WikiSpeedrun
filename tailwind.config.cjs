// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
    },
    extend: {
      colors: {
        "primary-blue": "hsla(203, 66%, 56%)",
        "secondary-blue": "hsl(204, 87%, 81%, 0.5)",
        "secondary-border": "#c9c9c98f",
        "dark-surface": "#1c1d1f",
        "dark-surface-secondary": "#303030",
        "dark-primary": "#e9e6e6",
      },
      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "spin-dice": "spin 1s linear infinite",
        overlayShow: "overlayShow 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerFadeIn: "fadeIn 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        drawerFadeOut: "fadeOut 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        drawerSlideInRight: "slideInRight 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        drawerSlideOutRight: "slideOutRight  250ms cubic-bezier(0.22, 1, 0.36, 1)",
        drawerSlideInLeft: "slideInLeft 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        drawerSlideOutLeft: "slideOutLeft 250ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideInRight: {
          from: { transform: "translate3d(100%,0,0)", opacity: 0 },
          to: { transform: "translate3d(0,0,0)", opacity: 1 },
        },
        slideOutRight: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(100%,0,0)" },
        },
        slideInLeft: {
          from: { transform: "translate3d(-100%,0,0)" },
          to: { transform: "translate3d(0,0,0)" },
        },
        slideOutLeft: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-100%,0,0)" },
        },
      },
    },
  },
  plugins: [],
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': 'hsla(203, 66%, 56%)',
        'secondary-blue': 'hsl(204, 87%, 81%, 0.5)',
        'secondary-border': '#c9c9c98f',
      },
      fontFamily: {
        sans: ['Noto Sans', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'spin-dice': 'spin 1s linear infinite',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

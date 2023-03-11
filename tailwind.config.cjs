/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "hsla(203, 66%, 56%)",
        "primary-border": "hsl(204, 87%, 81%, 0.5)",
      },
    },
  },
  plugins: [],
};

module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.cjs',
  singleQuote: true,
  arrowParens: 'always',
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  trailingComma: 'es5',
};

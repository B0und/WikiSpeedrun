import { createGlobalStyle } from "styled-components/macro";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  /* Remove built-in form typography styles */
  input, button, textarea, select {
    font: inherit;
  }

  /* Avoid text overflows */
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  /* Create a stacking context, without a z-index.
    This ensures that all portal content (modals and tooltips) will float above the app.
  */
  #root, #__next {
    isolation: isolate;
  }

  /* GLOBAL STYLES */
  *,
  *:before,
  *:after {
    font-family: 'Raleway', sans-serif;
  }

  html {
    /*
      Silence the warning about missing Reach Dialog styles
    */
    --reach-dialog: 1;
  }

`;

export default GlobalStyles;

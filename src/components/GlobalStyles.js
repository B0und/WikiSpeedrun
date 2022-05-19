import { css } from "@emotion/react"
import { COLORS } from "../constants"

const GlobalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }



  /* Remove built-in form typography styles */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Avoid text overflows */
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  /* Create a stacking context, without a z-index.
    This ensures that all portal content (modals and tooltips) will float above the app.
  */
  #root,
  #__next {
    isolation: isolate;
  }

  /* GLOBAL STYLES */
  *,
  *:before,
  *:after {
    font-family: "Noto Sans", sans-serif;
  }

  html {
    --primary-blue: hsla(203, 66%, 56%);
    --secondary-blue: hsl(204, 87%, 81%, 0.5);
    // silence the warning
    --reach-dialog: 1;
    --color-bg: ${COLORS.light.bg};
    --color-bg-secondary: ${COLORS.light.bgSecondary};
    --color-border-secondary: ${COLORS.light.borderSecondary};
    --color-text-primary: ${COLORS.light.textPrimary};
    --color-text-secondary: ${COLORS.light.textSecondary};
    --color-results-bg: ${COLORS.light.resultsBg};
    --color-backdrop-bg: ${COLORS.light.backdropBg};
  }

  [data-theme="dark"] {
    --color-bg: ${COLORS.dark.bg};
    --color-bg-secondary: ${COLORS.dark.bgSecondary};
    --color-border-secondary: ${COLORS.dark.borderSecondary};
    --color-text-primary: ${COLORS.dark.textPrimary};
    --color-text-secondary: ${COLORS.dark.textSecondary};
    --color-results-bg: ${COLORS.dark.resultsBg};
    --color-backdrop-bg: ${COLORS.dark.backdropBg};
  }
`

export default GlobalStyles

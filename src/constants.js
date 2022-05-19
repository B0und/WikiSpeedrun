export const BREAKPOINTS = {
  phone: 600,
  tablet: 950,
  laptop: 1300,
}

export const QUERIES = {
  phoneAndSmaller: `(max-width: ${BREAKPOINTS.phone / 16}rem)`,
  tabletAndSmaller: `(max-width: ${BREAKPOINTS.tablet / 16}rem)`,
  laptopAndSmaller: `(max-width: ${BREAKPOINTS.laptop / 16}rem)`,
}

export const COLORS = {
  light: {
    bg: "#fafafa",
    bgSecondary: "#e2e2e2",
    borderSecondary: "#c9c9c98f",
    textPrimary: "#111",
    textSecondary: "#2e2e2e",
    resultsBg: "#000000cc",
    backdropBg: "#2e2d2dcf",
  },
  dark: {
    bg: "#161616",
    bgSecondary: "#303030",
    borderSecondary: "#c9c9c98f",
    textPrimary: "#e9e6e6",
    textSecondary: "#a7a6a6",
    resultsBg: "#000000cc",
    backdropBg: "#2e2d2dcf",
  },
}

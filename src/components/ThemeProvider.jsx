import { useLocalStorageValue } from "@mantine/hooks"
import React from "react"
import { useEffect } from "react"
import { COLORS } from "../constants"

export const ThemeContext = React.createContext()

export const ThemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useLocalStorageValue({
    key: "color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  })
  console.log("INIT COLOR: ", colorScheme)

  const setRootStyles = (value) => {
    const root = window.document.documentElement

    root.style.setProperty("--color-bg", value === "light" ? COLORS.light.bg : COLORS.dark.bg)

    root.style.setProperty(
      "---color-bg-secondary",
      value === "light" ? COLORS.light.bgSecondary : COLORS.dark.bgSecondary
    )

    root.style.setProperty(
      "--color-border-secondary",
      value === "light" ? COLORS.light.borderSecondary : COLORS.dark.borderSecondary
    )

    root.style.setProperty(
      "--color-text-primary",
      value === "light" ? COLORS.light.textPrimary : COLORS.dark.textPrimary
    )

    root.style.setProperty(
      "--color-text-secondary",
      value === "light" ? COLORS.light.textSecondary : COLORS.dark.textSecondary
    )

    root.style.setProperty(
      "--color-results-bg",
      value === "light" ? COLORS.light.resultsBg : COLORS.dark.resultsBg
    )

    root.style.setProperty(
      "--color-backdrop-bg",
      value === "light" ? COLORS.light.backdropBg : COLORS.dark.backdropBg
    )
  }

  useEffect(() => {
    setRootStyles(colorScheme)
  }, [colorScheme])

  const toggleColorScheme = () => {
    setColorScheme((current) => (current === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

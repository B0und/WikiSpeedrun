import styled from "@emotion/styled"
import { UnstyledButton } from "@mantine/core"
import VisuallyHidden from "@reach/visually-hidden"
import React from "react"
import { ThemeContext } from "./App"
import Icon from "./Icon"

export const DarkToggle = () => {
  const { colorMode, switchTheme } = React.useContext(ThemeContext)

  return (
    <DarkToggleButton onClick={switchTheme}>
      <ThemeIcon id={colorMode === "light" ? "sun" : "moon"} />
      <VisuallyHidden>Switch theme</VisuallyHidden>
    </DarkToggleButton>
  )
}

const ThemeIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const DarkToggleButton = styled(UnstyledButton)`
  padding: 12px;
  margin: 2px;
  color: var(--color-text-primary);

  &:hover {
    color: var(--primary-blue);
  }
`

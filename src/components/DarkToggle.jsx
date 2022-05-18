import styled from "@emotion/styled"
import { UnstyledButton } from "@mantine/core"
import VisuallyHidden from "@reach/visually-hidden"
import React, { useState } from "react"
import { useEffect } from "react"
import Icon from "./Icon"
import { ThemeContext } from "./ThemeProvider"

export const DarkToggle = () => {
  const { colorMode, toggleColorScheme } = React.useContext(ThemeContext)
  console.log(colorMode)

  return (
    <DarkToggleButton onClick={toggleColorScheme}>
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

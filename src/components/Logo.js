import styled from "@emotion/styled"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectGameIsRunning } from "../redux/settingsSelectors"
import { ThemeContext } from "./ThemeProvider"
import React from "react"

function Logo() {
  const gameIsRunning = useSelector(selectGameIsRunning)
  const { colorMode, toggleColorScheme } = React.useContext(ThemeContext)

  return (
    <Heading>
      <StyledLink to={gameIsRunning ? "#" : "/settings"}>
        <Image
          src={
            window.location.origin + colorMode === "light"
              ? "/wiki-speed-logo.png"
              : "/wiki-speed-logo-dark.png"
          }
          alt="Wikipedia Speedrun"
          width={128}
          height={168}
        />
      </StyledLink>
    </Heading>
  )
}

const Heading = styled.h1`
  align-self: center;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const Image = styled.img`
  min-width: 128px;
`

export default Logo

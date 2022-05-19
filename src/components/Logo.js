import styled from "@emotion/styled"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectGameIsRunning } from "../redux/settingsSelectors"

import React from "react"
import { ThemeContext } from "./App"

function Logo() {
  const gameIsRunning = useSelector(selectGameIsRunning)
  const { colorMode } = React.useContext(ThemeContext)

  return (
    <Heading>
      <StyledLink to={gameIsRunning ? "#" : "/settings"}>
        {colorMode === "light" ? (
          <Image
            src={window.location.origin + "/wiki-speed-logo.png"}
            alt="Wikipedia Speedrun"
            width={128}
            height={168}
          />
        ) : (
          <Image
            src={window.location.origin + "/wiki-speed-logo-dark.png"}
            alt="Wikipedia Speedrun"
            width={128}
            height={168}
          />
        )}
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

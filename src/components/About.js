import styled from "@emotion/styled"

import LinkButton from "./LinkButton"
import { WikiHeader } from "./Wiki/WikiDisplay"

function About() {
  return (
    <Wrapper>
      <AboutHeader>Wiki Speedrun Game</AboutHeader>
      <p>
        The goal of the game is to navigate from a starting wikipedia article to another one, in the
        least amount of clicks and time.
      </p>

      <SecondaryHeading>Features</SecondaryHeading>

      <FeatureList>
        <li>No registration required</li>
        <li>Choose your own prompts</li>
        <li>
          High precision fair™ timer
          <ul>
            <li>actually stops while you are loading the next article</li>
          </ul>
        </li>
        <li>Optional Time Limit</li>
        <li>Keeps track of your session progress</li>
        <li>Open source</li>
      </FeatureList>

      <StyledLinkButton text="Play" to={"/settings"} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding-top: var(--border-gap);
  padding-left: var(--border-gap);
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const AboutHeader = styled(WikiHeader)`
  border-bottom: 1px solid var(--color-border-secondary);
  margin-bottom: 0.25em;
`

const StyledLinkButton = styled(LinkButton)`
  background: var(--secondary-blue);
  color: var(--color-text-primary);
`

const SecondaryHeading = styled.h3`
  font-size: ${24 / 16}rem;
  font-weight: 400;

  border-bottom: 1px solid var(--color-border-secondary);
  margin-top: 16px;
  margin-bottom: 0.25em;
`

const FeatureList = styled.ul`
  li:not(:last-child) {
    margin-bottom: 8px;
  }
`
export default About

import styled from "@emotion/styled";

import { WikiHeader } from "./Wiki/Wiki";
import LinkButton from "./LinkButton";

function About() {
  return (
    <Wrapper>
      <AboutHeader>Wiki Speedrun Game</AboutHeader>
      <p>
        The goal is simple: using links, navigate from one wiki article to
        another one, as fast as you can!
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
  );
}

const Wrapper = styled.div`
  padding-top: var(--border-gap);
  padding-left: var(--border-gap);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AboutHeader = styled(WikiHeader)`
  border-bottom: 1px solid #a2a9b178;
  margin-bottom: 0.25em;
`;

const StyledLinkButton = styled(LinkButton)`
  background: var(--secondary-blue);
  color: black;
`;

const SecondaryHeading = styled.h3`
  font-size: ${24/16}rem;
  font-weight: 400;

  border-bottom: 1px solid #a2a9b178;
  margin-top: 16px;
  margin-bottom: 0.25em;
`;

const FeatureList = styled.ul`
  li:not(:last-child) {
    margin-bottom: 8px;
  }
`;
export default About;

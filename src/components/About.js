import { WikiHeader } from "./Wiki";
import styled from "styled-components/macro";
import LinkButton from "./LinkButton";

function About() {
  return (
    <Wrapper>
      <AboutHeader>Wiki Speedrun Game</AboutHeader>

      <div>
        The goal is simple: using links, navigate from one wiki article to
        another one, as fast as you can!
      </div>
      <LinkButton text="Play" to={"/settings"} />
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
  border-bottom: 1px solid #a2a9b1;
  margin-bottom: 0.25em;
`;

export default About;

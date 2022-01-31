import { WikiHeader } from "../components/Wiki/Wiki";
import styled from "styled-components/macro";
import LinkButton from "../components/LinkButton";

function About() {
  return (
    <Wrapper>
      <AboutHeader>Wiki Speedrun Game</AboutHeader>
      <div>
        The goal is simple: using links, navigate from one wiki article to
        another one, as fast as you can!
      </div>
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
  border-bottom: 1px solid #a2a9b1;
  margin-bottom: 0.25em;
`;

const StyledLinkButton = styled(LinkButton)`
  background: var(--secondary-blue);
  color: black;
`;
export default About;

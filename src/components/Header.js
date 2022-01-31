import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import VisuallyHidden from "@reach/visually-hidden";
import Icon from "./Icon";
import { selectGameIsRunning } from "../redux/settingsSlice";
import { useSelector } from "react-redux";
import GiveUpButton from "./GiveUpButton";

const links = [
  { name: "Play", path: "/settings" },
  { name: "About", path: "/about" },
];

function Header() {
  const gameIsRunning = useSelector(selectGameIsRunning);

  return (
    <HeaderNav>
      <Pages>
        {gameIsRunning ? (
          <GiveUpButton />
        ) : (
          links.map((link) => (
            <li key={link.name}>
              <StyledLink to={link.path}>{link.name}</StyledLink>
            </li>
          ))
        )}
      </Pages>
      <MiscNav>
        <li>
          <GithubLink
            href="https://github.com/B0und/WikiSpeedrun"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon id="github" />
            <VisuallyHidden>Source code on github</VisuallyHidden>
          </GithubLink>
        </li>
      </MiscNav>
    </HeaderNav>
  );
}

const HeaderNav = styled.nav`
  display: flex;
  flex-direction: row;
  /* gap: 32px; */
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: calc(var(--border-gap) - 14px);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--primary-blue);
`;

const Pages = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  gap: 32px;
  padding-left: 0;
  text-align: baseline;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 16px;

  &:visited {
    color: inherit;
  }

  &:hover {
    color: blue;
  }
`;

const MiscNav = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

const GithubLink = styled.a`
  padding: 16px;
  text-decoration: none;
  &:visited {
    color: inherit;
  }

  &:hover {
    color: blue;
  }
`;

const GithubIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

export default Header;

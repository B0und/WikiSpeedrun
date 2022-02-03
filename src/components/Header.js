import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import VisuallyHidden from "@reach/visually-hidden";
import Icon from "./Icon";
import { selectGameIsRunning } from "../redux/settingsSlice";
import { useSelector } from "react-redux";
import GiveUpButton from "./GiveUpButton";
import { Drawer } from "@mantine/core";
import {  useState } from "react";

import Logo from "./Logo";
import History from "./History";
import { QUERIES } from "../constants";

const links = [
  { name: "Play", path: "/settings" },
  { name: "About", path: "/about" },
];

function Header() {
  const gameIsRunning = useSelector(selectGameIsRunning);
  const [opened, setOpened] = useState(false);

  return (
    <HeaderNav>
      <StyledDrawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xl"
        size="85%"
      >
        <Wrapper>
          <Logo />
          <History />
        </Wrapper>
      </StyledDrawer>

      <Pages>
        {gameIsRunning ? (
          <>
            <ToggleHistoryDrawer onClick={() => setOpened(true)}>
              History
            </ToggleHistoryDrawer>
            <GiveUpButton />
          </>
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: calc(var(--border-gap) - 14px);
  border-bottom: 1px solid var(--secondary-blue);
`;

const Pages = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  gap: 32px;
  padding-left: 0;
  text-align: baseline;

  @media ${QUERIES.tabletAndSmaller} {
    gap: 8px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 16px;
  color: #111;

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

const StyledDrawer = styled(Drawer)`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    display: block;
  }
`;
const ToggleHistoryDrawer = styled.button`
  display: none;

  cursor: pointer;
  border: none;
  background: none;
  color: black;
  text-align: center;
  padding: 16px;

  &:hover {
    color: blue;
  }

  @media ${QUERIES.tabletAndSmaller} {
    display: block;
  }
`;

const Wrapper = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-bottom: 32px;
`;

export default Header;

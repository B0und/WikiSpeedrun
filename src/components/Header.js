import styled from "styled-components/macro";
import { Link } from "react-router-dom";

const links = [
  { name: "Setup", path: "/" },
  { name: "About", path: "/about" },
];

function Header() {
  return (
    <HeaderNav>
      <Pages>
        {links.map((link) => (
          <li key={link.name}>
            <StyledLink to={link.path}>{link.name}</StyledLink>
          </li>
        ))}
      </Pages>
      <MiscNav>
        <a href="">
          <img src="./github.png" alt="Link to source code" />
        </a>
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
  padding-left: var(--border-gap);
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
`;

const MiscNav = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 32px;
`;
export default Header;

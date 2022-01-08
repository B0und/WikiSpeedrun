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
    </HeaderNav>
  );
}

const HeaderNav = styled.nav`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

const Pages = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  gap: 32px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Settings = styled.ul`
  list-style-type: none;

  display: flex;
  flex-direction: row;
  gap: 32px;
`;
export default Header;

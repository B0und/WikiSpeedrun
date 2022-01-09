import styled from "styled-components/macro";
import Logo from "./Logo";

function Sidebar() {
  return (
    <NavWrapper>
      <Logo />
    </NavWrapper>
  );
}

const NavWrapper = styled.nav`
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  /* flex-basis: 250px; */
  border-right: 1px solid var(--primary-blue);
  padding-right: var(--border-gap);
`;

export default Sidebar;

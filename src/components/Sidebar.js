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
  display: flex;
  flex-direction: column;
`;

export default Sidebar;

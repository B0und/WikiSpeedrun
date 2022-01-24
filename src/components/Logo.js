import styled from "styled-components/macro";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Heading>
      <StyledLink to="/settings">
        <Image
          src={window.location.origin + "/wiki-speed-logo.jpg"}
          alt="Wikipedia Speedrun"
        />
      </StyledLink>
    </Heading>
  );
}

const Heading = styled.h1`
  align-self: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Image = styled.img`
  min-width: 120px;
`;

export default Logo;

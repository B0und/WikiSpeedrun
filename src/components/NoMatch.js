import { Link } from "react-router-dom";
import styled from "styled-components/macro";

const NoMatch = () => {
  return (
    <Wrapper>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-left: var(--border-gap);
  padding-top: 8px;
`;
export default NoMatch;

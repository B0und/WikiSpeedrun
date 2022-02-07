import styled from "@emotion/styled";
import { QUERIES } from "../../constants";

const Stopwatch = ({ time }) => {
  return (
    <StyledStopwatch>
      <StopwatchBase>
        {time.m}:{time.s}
      </StopwatchBase>
      <StopwatchMs>.{time.ms}</StopwatchMs>
    </StyledStopwatch>
  );
};

const StyledStopwatch = styled.div`
  font-size: ${48 / 16}rem;
  text-align: right;

  @media ${QUERIES.tabletAndSmaller} {
    font-size: ${24 / 16}rem;
  }
`;

const GradientText = styled.span`
  background-image: linear-gradient(180deg, #4acd79, #1cad4a);
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -moz-text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
`;

const StopwatchBase = styled(GradientText)`
  font-size: 1em;
`;
const StopwatchMs = styled(GradientText)`
  font-size: 0.7em;
`;

export default Stopwatch;

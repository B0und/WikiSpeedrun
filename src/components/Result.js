import styled, { keyframes } from "styled-components/macro";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import UnstyledButton from "./UnstyledButton";
import VisuallyHidden from "@reach/visually-hidden";
import Icon from "./Icon";
import { useContext, useEffect } from "react";
import { StopwatchContext } from "./StopwatchContext";

const Result = ({ isOpen, onDismiss }) => {
  const stopwatch = useContext(StopwatchContext);

  useEffect(() => {
    if (isOpen) {
      stopwatch.pauseTimer();
    }
  }, [isOpen]);
  return (
    <Wrapper isOpen={isOpen} onDismiss={onDismiss}>
      <Backdrop />
      <Content aria-label="Result screen">
        <InnerWrapper>
          <CloseButton onClick={onDismiss}>
            <Icon id="close" />
            <VisuallyHidden>Dismiss results</VisuallyHidden>
          </CloseButton>
          <h1>You win!</h1>
          <div>
            Your time is: {stopwatch.time.m}:{stopwatch.time.s}.
            {stopwatch.time.ms}
          </div>
        </InnerWrapper>
      </Content>
    </Wrapper>
  );
};

export default Result;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled(DialogOverlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 600ms both;
  animation-delay: 400ms;

  text-align: center;
  vertical-align: middle;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2e2d2dcf;
  animation: ${fadeIn} 500ms;
`;

const Content = styled(DialogContent)`
  position: relative;
  background: white;
  width: 50%;
  height: 25%;
  padding: 24px 32px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 10px;
  right: 0px;
  padding: 16px;
`;

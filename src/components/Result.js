import styled, { keyframes } from "styled-components/macro";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import UnstyledButton from "./UnstyledButton";
import VisuallyHidden from "@reach/visually-hidden";
import Icon from "./Icon";

const Result = ({ isOpen, onDismiss }) => {
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

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
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
  justify-content: flex-end;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 600ms both;
  animation-delay: 400ms;
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
  --overfill: 16px;
  position: relative;
  background: white;
  width: 50%;
  height: 25%;
  padding: 24px 32px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${slideIn} 500ms both cubic-bezier(0, 0.6, 0.32, 1.06);
    animation-delay: 200ms;
  }
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 10px;
  right: var(--overfill);
  padding: 16px;
`;

const Filler = styled.div`
  flex: 1;
`;

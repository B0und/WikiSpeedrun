import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "@emotion/styled/macro";
import { keyframes } from "@emotion/react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import ConfettiExplosion from "react-confetti-explosion";

import Icon from "./Icon";
import { StopwatchContext } from "./Stopwatch/StopwatchContext";
import Stopwatch from "./Stopwatch/Stopwatch";
import UnstyledButton from "./UnstyledButton";
import LinkButton from "./LinkButton";
import {
  selectEndingArticle,
  selectHistory,
  selectStartingArticle,
} from "../redux/settingsSlice";
import { QUERIES } from "../constants";

const Result = ({ isOpen, onDismiss, isWin }) => {
  const stopwatch = useContext(StopwatchContext);
  const startTitle = useSelector(selectStartingArticle).title;
  const endTitle = useSelector(selectEndingArticle).title;
  const history = useSelector(selectHistory);

  const confettiParams = {
    force: 0.6,
    duration: 4000,
    particleCount: 400,
    floorHeight: 1600,
    floorWidth: 1600,
  };

  const wordInString = (s, word) =>
    new RegExp("\\b" + word + "\\b", "i").test(s);

  useEffect(() => {
    if (isOpen) {
      stopwatch.pauseTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return (
    <Wrapper isOpen={isOpen} onDismiss={onDismiss}>
      <Backdrop />
      <Content aria-label="Result screen">
        <ConfettiWrapper>
          {isWin === true ? <ConfettiExplosion {...confettiParams} /> : null}
          <InnerWrapper>
            <CloseButton onClick={onDismiss}>
              <Icon id="close" />
              <VisuallyHidden>Dismiss results</VisuallyHidden>
            </CloseButton>
            {isWin ? (
              <ContentWrapper>
                <Heading>You win!</Heading>
                <InfoText>
                  From <b>{startTitle}</b> to <b>{endTitle} </b>
                  in {history.length - 1} clicks.
                </InfoText>
                <Stopwatch time={stopwatch.time} />
                {wordInString(endTitle, "anime") ? (
                  <Image
                    src={window.location.origin + "/wiki-waifu-sketch.png"}
                    alt="Wikipedia Waifu by @ina_den_"
                    width={600}
                    height={800}
                  />
                ) : null}
                <LinkButton text="Play again" to={"/settings"} />
              </ContentWrapper>
            ) : (
              <ContentWrapper>
                <Heading>You lose</Heading>
                <LinkButton text="Try again" to={"/settings"} />
              </ContentWrapper>
            )}
          </InnerWrapper>
        </ConfettiWrapper>
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
  overflow: auto;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 600ms both;
  animation-delay: 400ms;

  text-align: center;
  vertical-align: middle;

  width: 100%;
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
  width: 70%;
  padding: 56px;

  max-height: 90%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media ${QUERIES.tabletAndSmaller} {
    padding: 56px 24px;
  }
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 10px;
  right: 0px;
  padding: 16px;
`;

const Heading = styled.h2`
  font-size: ${36 / 16}rem;

  @media ${QUERIES.tabletAndSmaller} {
    font-size: ${24 / 16}rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  @media ${QUERIES.tabletAndSmaller} {
    gap: 16px;
  }
`;

const InfoText = styled.p`
  font-size: ${18 / 16}rem;

  @media ${QUERIES.tabletAndSmaller} {
    font-size: ${16 / 16}rem;
  }
`;

const Image = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
  /* height: 500px; */
  height: auto;
  /* max-width: 700px; */
  max-height: 600px;
`;

const ConfettiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

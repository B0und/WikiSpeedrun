import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import {
  setStartingArticle,
  setEndingArticle,
  selectStartingArticle,
  selectEndingArticle,
  resetHistory,
  startGame,
  setTimeLimit,
  setIsWin,
} from "../redux/settingsSlice";
import { StopwatchContext } from "./Stopwatch/StopwatchContext";
import AutocompleteArticle from "./AutocompleteArticle";
import RandomArticleButton from "./RandomArticleButton";
import TimeLimit from "./TimeLimit";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stopwatch = useContext(StopwatchContext);
  const [time, setTime] = useState(new Date(0, 0, 0, 0, 0, 0, 0));

  let startingTitle = useSelector(selectStartingArticle).title;
  let endingTitle = useSelector(selectEndingArticle).title;

  useEffect(() => {
    // reset previous session
    dispatch(resetHistory());
    dispatch(setIsWin(null));
    stopwatch.resetTimer();
    stopwatch.disableTimer(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startHandler = (e) => {
    e.preventDefault();
    if (!startingTitle || !endingTitle) {
      alert("Please select a value from the dropdown");
      return;
    }

    navigate("/wiki");
    dispatch(setTimeLimit(stopwatch.getInputTimeDiff(time)));
    dispatch(startGame());
  };

  return (
    <Wrapper onSubmit={startHandler}>
      <Title>Settings</Title>

      <SettingDescription>
        Please type and then select values from the dropdown list or press the
        random button.
      </SettingDescription>

      <InputContainer>
        <AutocompleteArticle
          key={"inp1"}
          selectHandler={(item) => {
            item && dispatch(setStartingArticle(item));
          }}
          initialTerm={startingTitle}
          label="Select starting article"
        />

        <RandomArticleButton dispatchFn={setStartingArticle} />
      </InputContainer>

      <InputContainer>
        <AutocompleteArticle
          key={"inp2"}
          selectHandler={(item) => {
            item && dispatch(setEndingArticle(item));
          }}
          initialTerm={endingTitle}
          label="Select ending article"
        />
        <RandomArticleButton dispatchFn={setEndingArticle} />
      </InputContainer>

      <TimeLimit time={time} setTime={setTime} />

      <StartButton type="submit">Start</StartButton>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  padding-left: var(--border-gap);
  padding-top: var(--border-gap);

  width: fit-content;
`;

const SettingDescription = styled.p`
  margin: 8px 0px;
  margin-bottom: 16px;
`;
const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: 700;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 16px;
`;

const StartButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: var(--primary-blue);
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  padding: 10px 20px;
  width: 120px;
  margin-top: 32px;
`;

export default Settings;

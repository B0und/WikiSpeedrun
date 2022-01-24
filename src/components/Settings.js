import styled from "styled-components/macro";
import ComboBoxSearch from "./ComboBoxSearch";
import { Link, Prompt, useNavigate } from "react-router-dom";
import {
  setStartingArticle,
  setEndingArticle,
  selectStartingArticle,
  selectEndingArticle,
  resetHistory,
} from "./settingsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { StopwatchContext } from "./StopwatchContext";
import UnstyledButton from "./UnstyledButton";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stopwatch = useContext(StopwatchContext);

  const startId = "starting-article";
  const endId = "ending-article";

  const startingTitle = useSelector(selectStartingArticle).title;
  const endingTitle = useSelector(selectEndingArticle).title;

  const startHandler = (e) => {
    e.preventDefault();
    dispatch(resetHistory());
    stopwatch.resetTimer();
    stopwatch.disableTimer(false);
    navigate("/wiki");
  };

  return (
    <Wrapper onSubmit={startHandler}>
      <Title>Settings</Title>
      <SettingDescription>
        Please type and then select values from the dropdown list or press the
        random button.
      </SettingDescription>
      <SettingField>
        <SettingLabel htmlFor={startId}>Starting Article</SettingLabel>
        <ComboBoxSearch
          inputId={startId}
          initialTerm={startingTitle}
          selectHandler={(item) => {
            dispatch(setStartingArticle(item));
          }}
        />
        <RandomButton type="button">
          <img
            src={window.location.origin + "/dice.svg"}
            alt="Select random article"
          />
        </RandomButton>
      </SettingField>
      <SettingField>
        <SettingLabel htmlFor={endId}>Ending Article</SettingLabel>
        <ComboBoxSearch
          initialTerm={endingTitle}
          inputId={endId}
          selectHandler={(item) => {
            dispatch(setEndingArticle(item));
          }}
        />
        <RandomButton type="button">
          <img
            src={window.location.origin + "/dice.svg"}
            alt="Select random article"
          />
        </RandomButton>
      </SettingField>
      <StartButton type="submit">Start</StartButton>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  padding-left: var(--border-gap);
  padding-top: var(--border-gap);
  /* gap: 32px; */

  width: min-content;
`;

const SettingDescription = styled.p`
  margin: 8px 0px;
`;
const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: 600;
`;

const SettingField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;

  /* direct children */
  & > :first-child {
    flex: 1;
  }
`;

const SettingLabel = styled.label`
  white-space: nowrap;
  text-align: left;
`;

const StartButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: #e9e9ed;
  color: black;
  text-align: center;
  padding: 10px 20px;
  width: 120px;
`;

const RandomButton = styled(UnstyledButton)`
  padding: 16px;

  img {
    min-width: 24px;
  }
`;

export default Settings;

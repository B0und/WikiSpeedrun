import styled from "styled-components/macro";
import ComboBoxSearch from "./ComboBoxSearch";
import { Link } from "react-router-dom";
import {
  setStartingArticle,
  setEndingArticle,
  selectStartingArticle,
  selectEndingArticle,
} from "./settingsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { StopwatchContext } from "./StopwatchContext";
import LinkButton from "./LinkButton";

function Settings() {
  const dispatch = useDispatch();
  const stopwatch = useContext(StopwatchContext);

  const startId = "starting-article";
  const endId = "ending-article";

  const startingTitle = useSelector(selectStartingArticle).title;
  const endingTitle = useSelector(selectEndingArticle).title;

  const startHandler = () => {
    stopwatch.resetTimer();
    stopwatch.disableTimer(false);
  };

  return (
    <Wrapper>
      <Title>Settings</Title>
      <SettingField>
        <label htmlFor={startId}>Starting Article</label>
        <ComboBoxSearch
          inputId={startId}
          initialTerm={startingTitle}
          selectHandler={(item) => {
            dispatch(setStartingArticle(item));
          }}
        />
        <button>
          <img
            src={window.location.origin + "/dice.svg"}
            alt="Select random article"
          />
        </button>
      </SettingField>
      <SettingField>
        <label htmlFor={endId}>Ending Article</label>
        <ComboBoxSearch
          initialTerm={endingTitle}
          inputId={endId}
          selectHandler={(item) => {
            dispatch(setEndingArticle(item));
          }}
        />
        <button>
          <img
            src={window.location.origin + "/dice.svg"}
            alt="Select random article"
          />
        </button>
      </SettingField>
      <LinkButton text="Start" onClick={startHandler} to="/wiki" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: var(--border-gap);
  padding-top: var(--border-gap);
  gap: 32px;

  width: fit-content;
`;

const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: 600;
`;

const SettingField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 32px;

  /* direct children */
  & > :first-child {
    flex: 1;
  }
`;

export default Settings;

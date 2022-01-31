import styled from "styled-components/macro";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setStartingArticle,
  setEndingArticle,
  selectStartingArticle,
  selectEndingArticle,
  resetHistory,
  startGame,
} from "./settingsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { StopwatchContext } from "./StopwatchContext";
import UnstyledButton from "./UnstyledButton";
import AutocompleteArticle from "./AutocompleteArticle";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stopwatch = useContext(StopwatchContext);

  let startingTitle = useSelector(selectStartingArticle).title;
  let endingTitle = useSelector(selectEndingArticle).title;

  const getRandomWikiArticle = async () => {
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        origin: "*",
        action: "query",
        format: "json",
        list: "random",
        rnnamespace: "0",
        rnlimit: "1",
      },
    });
    const title = resp.data.query.random[0].title;
    // const pageid = resp.data.query.random[0].id;
    return { title };
  };

  const randomHandler = async (fn) => {
    const article = await getRandomWikiArticle();
    dispatch(fn(article));
  };

  const startHandler = (e) => {
    e.preventDefault();
    if (!startingTitle || !endingTitle) {
      alert("Please select a value from the dropdown");
      return;
    }
    dispatch(resetHistory());
    stopwatch.resetTimer();
    stopwatch.disableTimer(false);
    navigate("/wiki");
    dispatch(startGame());
  };

  return (
    <Wrapper onSubmit={startHandler}>
      <Title>Settings</Title>

      <SettingDescription>
        Please type and then select values from the dropdown list or press the
        random button.
      </SettingDescription>

      <SettingField>
        <AutocompleteArticle
          key={"inp1"}
          selectHandler={(item) => {
            dispatch(setStartingArticle(item));
          }}
          initialTerm={startingTitle}
          label="Select starting article"
        />

        <RandomButton
          onClick={() => randomHandler(setStartingArticle)}
          type="button"
        >
          <img
            src={window.location.origin + "/dice.svg"}
            alt="Select random article"
          />
        </RandomButton>
      </SettingField>

      <SettingField>
        <AutocompleteArticle
          key={"inp2"}
          selectHandler={(item) => {
            dispatch(setEndingArticle(item));
          }}
          initialTerm={endingTitle}
          label="Select ending article"
        />
        <RandomButton
          onClick={() => randomHandler(setEndingArticle)}
          type="button"
        >
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

  width: fit-content;
`;

const SettingDescription = styled.p`
  margin: 8px 0px;
  margin-bottom: 16px;
`;
const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: 600;
`;

const SettingField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 16px;

  /* direct children */
  & > :first-child {
    flex: 1;
  }
`;

const StartButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: #e9e9ed;
  color: black;
  text-align: center;
  padding: 10px 20px;
  width: 120px;
  margin-top: 8px;
`;

const RandomButton = styled(UnstyledButton)`
  padding: 16px;
  margin-bottom: 5px;

  img {
    min-width: 24px;
  }
`;

export default Settings;

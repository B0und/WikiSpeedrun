import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styled from "@emotion/styled/macro";

import { StopwatchContext } from "../Stopwatch/StopwatchContext";
import useDidMountEffect from "../../hooks/useDidMountEffect";

import "./wiki-common.css";
import "./wiki-vec2.css";
import search from "./WikiApi";

import WikiDisplay from "./WikiDisplay";
import {
  selectEndingArticle,
  selectHistory,
  selectIsWin,
  selectStartingArticle,
} from "../../redux/settingsSelectors";
import {
  addToHistory,
  endGame,
  setIsWin,
  setTimeLimit,
  setWinTime,
} from "../../redux/settingsSlice";

// FIXME
// List of prime ministers of the United Kingdom by education

function WikiRenderer() {
  let routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stopwatch = useContext(StopwatchContext);

  const [wikiData, setWikiData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startTitle = useSelector(selectStartingArticle).title;
  const endTitle = useSelector(selectEndingArticle).title;
  const history = useSelector(selectHistory);
  const isWin = useSelector(selectIsWin);

  const wikiSearch = useCallback(async (searchText) => {
    setIsLoading(true);
    const result = await search(searchText);
    setWikiData(result);
    setIsLoading(false);
  }, []);

  // track user history
  useDidMountEffect(() => {
    if (wikiData.title) {
      let time = stopwatch.getCurrentTime();

      // workaround for the first entry being logged slightly later than 0
      if (history.length === 0) {
        time.ms = "000";
      }
      dispatch(addToHistory({ title: wikiData.title, time }));
    }
  }, [wikiData.title]);

  // pause timer while article is loading
  useDidMountEffect(() => {
    isLoading ? stopwatch.pauseTimer() : stopwatch.startTimer();
  }, [isLoading]);

  // render initial wiki article
  useEffect(() => {
    wikiSearch(startTitle).catch((e) => {
      console.error(`Couldnt fetch wiki data: ${e.message}`);
      navigate("/settings");
    });
    stopwatch.resetTimer();
    stopwatch.startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTitle]);

  // render article from route parameters
  useEffect(() => {
    if (routeParams.wikiTitle) {
      wikiSearch(routeParams.wikiTitle).catch((e) =>
        console.error(`Couldnt fetch wiki data: ${e.message}`)
      );
    }
  }, [routeParams.wikiTitle, wikiSearch]);

  // track winning condition
  useEffect(() => {
    if (endTitle === wikiData.title) {
      stopwatch.pauseTimer();
      stopwatch.disableTimer(true);
      dispatch(setWinTime(stopwatch.getCurrentTime()));
      dispatch(setIsWin(true));
      dispatch(setTimeLimit(null));
      dispatch(endGame());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTitle, wikiData]);

  // show result screen if win state changes
  useDidMountEffect(() => {
    setShowResults(true);
  }, [isWin]);

  return (
    <>
      <HeaderGoal>
        {startTitle} → {endTitle}
      </HeaderGoal>

      <WikiDisplay
        showResults={showResults}
        setShowResults={setShowResults}
        wikiData={wikiData}
        isLoading={isLoading}
      />
    </>
  );
}

const HeaderGoal = styled.span`
  font-size: ${18 / 16}rem;
  font-weight: 700;
  margin-left: var(--border-gap);
  margin-top: 10px;
`;

export default WikiRenderer;

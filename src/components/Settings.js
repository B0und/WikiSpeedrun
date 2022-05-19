import { useContext, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "@emotion/styled"
import { useNavigate, useSearchParams } from "react-router-dom"

import { StopwatchContext } from "./Stopwatch/StopwatchContext"
import AutocompleteArticle from "./AutocompleteArticle"
import RandomArticleButton from "./RandomArticleButton"
import TimeLimit from "./TimeLimit/TimeLimit"
import { selectEndingArticle, selectStartingArticle } from "../redux/settingsSelectors"
import {
  resetHistory,
  setEndingArticle,
  setIsWin,
  setStartingArticle,
  setTimeLimit,
  startGame,
} from "../redux/settingsSlice"
import { useRef } from "react"
import { useCallback } from "react"
import { useNotifications } from "@mantine/notifications"

function Settings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useNotifications()

  const shareNotificationParams = {
    title: "Copied",
    message: "URL was copied to clipboard",
    autoClose: 2000,
    color: "green",
  }

  let [searchParams, setSearchParams] = useSearchParams()

  const stopwatch = useContext(StopwatchContext)
  const stopwatchRef = useRef(stopwatch)
  const [time, setTime] = useState(new Date(0, 0, 0, 0, 0, 0, 0))

  let startTitle = useSelector(selectStartingArticle).title
  let startId = useSelector(selectStartingArticle).pageid

  let endTitle = useSelector(selectEndingArticle).title
  let endId = useSelector(selectEndingArticle).pageid

  const getStateFromUrl = useCallback(() => {
    const paramValues = ["startTitle", "startId", "endTitle", "endId"]
    const result = []
    for (const param of paramValues) {
      result.push(searchParams.get(param))
    }
    return result
  }, [searchParams])

  const selectStartingArticleHandler = useCallback(
    (item) => {
      // update redux on user choice
      item && dispatch(setStartingArticle(item))
    },
    [dispatch]
  )

  const selectEndingArticleHandler = useCallback(
    (item) => {
      // update redux on user choice
      item && dispatch(setEndingArticle(item))
    },
    [dispatch]
  )

  useEffect(() => {
    // reset previous session
    dispatch(resetHistory())
    dispatch(setIsWin(null))
    stopwatchRef.current.resetTimer()
    stopwatchRef.current.disableTimer(false)

    const [startTitle, startId, endTitle, endId] = getStateFromUrl()
    if (startTitle && startId) {
      selectStartingArticleHandler({ title: startTitle, pageid: startId })
    }

    if (endTitle && endId) {
      selectEndingArticleHandler({ title: endTitle, pageid: endId })
    }
  }, [dispatch, getStateFromUrl, selectEndingArticleHandler, selectStartingArticleHandler])

  useEffect(() => {
    const paramValues = ["startTitle", "startId", "endTitle", "endId"]

    for (const param of paramValues) {
      if (!searchParams.get(param) || searchParams.get(param) !== -1) {
        const oldParams = paramsToObject(searchParams.entries())
        setSearchParams({
          ...oldParams,
          param,
        })
      }
    }

    setSearchParams({
      startTitle: startTitle,
      startId: startId,
      endTitle: endTitle,
      endId: endId,
    })
  }, [endId, endTitle, searchParams, setSearchParams, startId, startTitle])

  function paramsToObject(entries) {
    const result = {}
    for (const [key, value] of entries) {
      // each 'entry' is a [key, value] tupple
      result[key] = value
    }
    return result
  }

  const startHandler = (e) => {
    e.preventDefault()
    if (!startTitle || !endTitle) {
      alert("Please select a value from the dropdown")
      return
    }

    navigate("/wiki")
    dispatch(setTimeLimit(stopwatch.getInputTimeDiff(time)))
    dispatch(startGame())
  }

  return (
    <Wrapper onSubmit={startHandler}>
      <Title>Settings</Title>

      <SettingDescription>
        Please type and then select values from the dropdown list or press the random button.
      </SettingDescription>

      <InputContainer>
        <AutocompleteArticle
          key={"inp1"}
          selectHandler={selectStartingArticleHandler}
          initialTerm={startTitle}
          label="Select starting article"
        />

        <RandomArticleButton dispatchFn={setStartingArticle} />
      </InputContainer>

      <InputContainer>
        <AutocompleteArticle
          key={"inp2"}
          selectHandler={selectEndingArticleHandler}
          initialTerm={endTitle}
          label="Select ending article"
        />
        <RandomArticleButton dispatchFn={setEndingArticle} />
      </InputContainer>

      <TimeLimit time={time} setTime={setTime} />

      <ButtonContainer>
        <StartButton type="submit">Start</StartButton>
        <ShareButton
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            notifications.showNotification(shareNotificationParams)
          }}>
          Share Settings
        </ShareButton>
      </ButtonContainer>
    </Wrapper>
  )
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  padding-left: var(--border-gap);
  padding-top: var(--border-gap);

  width: fit-content;
`

const SettingDescription = styled.p`
  margin: 8px 0px;
  margin-bottom: 32px;
`
const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: 700;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 16px;
`

const StartButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: var(--primary-blue);
  color: #fafafa;
  font-weight: 500;
  text-align: center;
  padding: 10px 20px;
  width: 120px;
  margin-top: 32px;
`

const ShareButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: inherit;
  color: var(--color-text-primary);
  font-weight: 500;
  text-align: center;
  padding: 10px 0px;
  width: fit-content;
  margin-top: 32px;
  /* text-decoration: underline; */
  border-bottom: 2px solid var(--primary-blue);
`
const ButtonContainer = styled.div`
  display: flex;
  gap: 32px;
`
export default Settings

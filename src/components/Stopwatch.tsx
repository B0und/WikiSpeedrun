import { useHistory, useIsGameRunning } from "../stores/GameStore"
import { useStopwatchValue } from "./StopwatchContext"
import { StopwatchDisplay } from "./StopwatchDisplay"

export const Stopwatch = () => {
  const { time } = useStopwatchValue()
  const history = useHistory()
  const isGameRunning = useIsGameRunning()
  const lastArticle = history.length > 0 ? history.slice(-1)[0] : undefined

  const min = isGameRunning ? time.min : lastArticle?.time.min
  const sec = isGameRunning ? time.sec : lastArticle?.time.sec
  const ms = isGameRunning ? time.ms : lastArticle?.time.ms

  return <StopwatchDisplay min={min} sec={sec} ms={ms} />
}

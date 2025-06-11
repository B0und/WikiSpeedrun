import { useNavigate } from "react-router"
import { useGameStoreActions } from "../stores/GameStore"
import { useStopwatchActions } from "../components/StopwatchContext"

export const useResetGame = () => {
  const navigate = useNavigate()
  const { resetStoreState, setIsWin } = useGameStoreActions()
  const { resetStopwatch } = useStopwatchActions()

  return () => {
    setIsWin(false)
    resetStopwatch()
    resetStoreState()
    void navigate("/settings")
  }
}

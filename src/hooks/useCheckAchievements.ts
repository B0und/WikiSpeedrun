import { useEffect } from "react"
import { type StatsValues, useStatsStore } from "../stores/StatisticsStore"
import { useUnlockAchievements } from "./useUnlockAchievements"

interface UseCheckAchievementsProps {
  trackedStats: (keyof StatsValues)[]
}
/**
 *  run check achievements logic, when some of the stats change
 */
export const useCheckAchievements = ({ trackedStats }: UseCheckAchievementsProps) => {
  const checkAchievements = useUnlockAchievements()
  useEffect(() => {
    //
    const unsubscribe = useStatsStore.subscribe((state, prevState) => {
      for (const stat of trackedStats) {
        if (state[stat] > prevState[stat]) {
          checkAchievements()
          break
        }
      }
    })
    return unsubscribe
  }, [checkAchievements, trackedStats])
}

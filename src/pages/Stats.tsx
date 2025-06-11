import { InfoTooltip } from "../components/InfoTooltip"
import { useI18nContext } from "../i18n/i18n-react"
import {
  useArticleClicks,
  useArticlePreviewPressed,
  useKnownWikiLanguages,
  useRandom1Pressed,
  useRandom5Pressed,
  useTotalRuns,
  useWins,
} from "../stores/StatisticsStore"

export const Stats = () => {
  const { LL } = useI18nContext()
  const articleClicks = useArticleClicks()
  const articlePreviewPressed = useArticlePreviewPressed()
  // const averageAnswerTime = useAverageAnswerTime(); // TODO
  // const fastestAnswerTime = useFastestAnswerTime(); // TODO
  // const slowestAnswerTime = useSlowestAnswerTime(); // TODO
  const knownWikiLanguages = useKnownWikiLanguages()
  const random1Pressed = useRandom1Pressed()
  const random5Pressed = useRandom5Pressed()
  const totalRuns = useTotalRuns()
  const wins = useWins()

  return (
    <>
      <div className="border-secondary-border border-b-[1px]">
        <InfoTooltip>
          <h2 className="font-serif text-3xl">{LL.Statistics()}</h2>
        </InfoTooltip>
      </div>
      <div className="@container">
        <ul className="flex @3xl:max-w-[calc(min(50%,700px))] flex-col gap-3 pt-4">
          <Stat name={LL["Wins:"]()} value={wins} />
          <Stat name={LL["Total games:"]()} value={totalRuns} />
          {/* <Stat name="Average Answer Time:" value={averageAnswerTime} />
          <Stat name="Fastest Answer Time:" value={fastestAnswerTime} />
          <Stat name="slowestAnswerTime:" value={slowestAnswerTime} /> */}
          <Stat name={LL["Known languages:"]()} value={knownWikiLanguages.length} />
          <Stat name={LL["Random choices:"]()} value={random1Pressed + random5Pressed} />
          <Stat name={LL["Articles clicked:"]()} value={articleClicks} />
          <Stat name={LL["Previewed Articles:"]()} value={articlePreviewPressed} />
        </ul>
      </div>
    </>
  )
}

const Stat = ({ name, value }: { name: string; value: React.ReactNode }) => {
  return (
    <li className="stat-wrapper flex text-secondary-border">
      <span className="order-1 text-black dark:text-dark-primary">{name}</span>
      <span className="order-3 text-black dark:text-dark-primary">{value}</span>
    </li>
  )
}

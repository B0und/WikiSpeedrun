import { InfoTooltip } from "../components/InfoTooltip";
import { useLingui } from "@lingui/react/macro";
import {
  useArticleClicks,
  useArticlePreviewPressed,
  useKnownWikiLanguages,
  useRandom1Pressed,
  useRandom5Pressed,
  useTotalRuns,
  useWins,
} from "../stores/StatisticsStore";

export const Stats = () => {
  const { t } = useLingui();
  const articleClicks = useArticleClicks();
  const articlePreviewPressed = useArticlePreviewPressed();
  // const averageAnswerTime = useAverageAnswerTime(); // TODO
  // const fastestAnswerTime = useFastestAnswerTime(); // TODO
  // const slowestAnswerTime = useSlowestAnswerTime(); // TODO
  const knownWikiLanguages = useKnownWikiLanguages();
  const random1Pressed = useRandom1Pressed();
  const random5Pressed = useRandom5Pressed();
  const totalRuns = useTotalRuns();
  const wins = useWins();

  return (
    <>
      <div className="border-secondary-border border-b-[1px]">
        <InfoTooltip>
          <h2 className="font-serif text-3xl">{t({ id: "Statistics" })}</h2>
        </InfoTooltip>
      </div>
      <div className="@container">
        <ul className="flex @3xl:max-w-[calc(min(50%,700px))] flex-col gap-3 pt-4">
          <Stat name={t({ id: "Wins:" })} value={wins} />
          <Stat name={t({ id: "Total games:" })} value={totalRuns} />
          {/* <Stat name="Average Answer Time:" value={averageAnswerTime} />
          <Stat name="Fastest Answer Time:" value={fastestAnswerTime} />
          <Stat name="slowestAnswerTime:" value={slowestAnswerTime} /> */}
          <Stat name={t({ id: "Known languages:" })} value={knownWikiLanguages.length} />
          <Stat name={t({ id: "Random choices:" })} value={random1Pressed + random5Pressed} />
          <Stat name={t({ id: "Articles clicked:" })} value={articleClicks} />
          <Stat name={t({ id: "Previewed Articles:" })} value={articlePreviewPressed} />
        </ul>
      </div>
    </>
  );
};

const Stat = ({ name, value }: { name: string; value: React.ReactNode }) => {
  return (
    <li className="stat-wrapper flex text-secondary-border">
      <span className="order-1 text-black dark:text-dark-primary">{name}</span>
      <span className="order-3 text-black dark:text-dark-primary">{value}</span>
    </li>
  );
};

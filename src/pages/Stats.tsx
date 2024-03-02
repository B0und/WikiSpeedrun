import {
  useArticleClicks,
  useArticlePreviewPressed,
  useAverageAnswerTime,
  useFastestAnswerTime,
  useGiveUpCount,
  useKnownWikiLanguages,
  useRandom1Pressed,
  useRandom5Pressed,
  useShareSettingsPressed,
  useSlowestAnswerTime,
  useTotalRuns,
  useWins,
} from "../stores/StatisticsStore";
// TODO add i18n

export const Stats = () => {
  const articleClicks = useArticleClicks();
  const articlePreviewPressed = useArticlePreviewPressed();
  const averageAnswerTime = useAverageAnswerTime();
  const fastestAnswerTime = useFastestAnswerTime();
  const giveUpCount = useGiveUpCount();
  const knownWikiLanguages = useKnownWikiLanguages();
  const random1Pressed = useRandom1Pressed();
  const random5Pressed = useRandom5Pressed();
  const shareSettingsPressed = useShareSettingsPressed();
  const slowestAnswerTime = useSlowestAnswerTime();
  const totalRuns = useTotalRuns();
  const wins = useWins();

  return (
    <>
      <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl">Statistics</h2>
      <div className="@container">
        <ul className="flex flex-col  gap-3 pt-4 @3xl:max-w-[calc(min(50%,700px))]">
          <Stat name="wins:" value={wins} />
          <Stat name="totalRuns:" value={totalRuns} />
          <Stat name="giveUpCount:" value={giveUpCount} />
          <Stat name="Average Answer Time:" value={averageAnswerTime} />
          <Stat name="Fastest Answer Time:" value={fastestAnswerTime} />
          <Stat name="slowestAnswerTime:" value={slowestAnswerTime} />
          <Stat name="knownWikiLanguages:" value={knownWikiLanguages} />
          <Stat name="random1Pressed:" value={random1Pressed} />
          <Stat name="random5Pressed:" value={random5Pressed} />
          <Stat name="shareSettingsPressed:" value={shareSettingsPressed} />
          <Stat name="Articles clicked:" value={articleClicks} />
          <Stat name="Previewed Articles:" value={articlePreviewPressed} />
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

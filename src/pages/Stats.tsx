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
  useAchievements,
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
      <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl">{"Statistics"}</h2>
      <div className="flex flex-col gap-2 pt-4">
        <Stat name="wins:" value={wins} />
        <Stat name="totalRuns:" value={totalRuns} />
        <Stat name="giveUpCount:" value={giveUpCount} />
        <br />

        <Stat name="Average Answer Time:" value={averageAnswerTime} />
        <Stat name="Fastest Answer Time:" value={fastestAnswerTime} />
        <Stat name="slowestAnswerTime:" value={slowestAnswerTime} />
        <br />

        <Stat name="knownWikiLanguages:" value={knownWikiLanguages} />
        <Stat name="random1Pressed:" value={random1Pressed} />
        <Stat name="random5Pressed:" value={random5Pressed} />
        <Stat name="shareSettingsPressed:" value={shareSettingsPressed} />
        <Stat name="Articles clicked:" value={articleClicks} />
        <Stat name="Previewed Articles:" value={articlePreviewPressed} />
      </div>
    </>
  );
};

const Stat = ({ name, value }: { name: string; value: React.ReactNode }) => {
  return (
    <p className="flex gap-2">
      <span className="text-right">{name}</span> <span className="text-left">{value}</span>
    </p>
  );
};

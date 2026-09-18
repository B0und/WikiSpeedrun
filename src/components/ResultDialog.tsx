import * as Dialog from "@radix-ui/react-dialog";
import * as Portal from "@radix-ui/react-portal";
import { useState } from "react";
import { useResetGame } from "../hooks/useResetGame";
import { useLingui } from "@lingui/react/macro";
import {
  useCheatingAttempts,
  useClicks,
  useEndingArticle,
  useHistory,
  useIsWin,
  useStartingArticle,
  useWinCount,
} from "../stores/GameStore";
import { copyNotification } from "../utils/toast";
import { ModalContent, ModalDescription, ModalRoot, ModalTitle, ModalTrigger } from "./Modal";
import { StartArrowEnd } from "./StartArrowEnd";
import { StopwatchDisplay } from "./StopwatchDisplay";
import { VictoryConfetti } from "./VictoryConfetti";

export const ResultDialog = () => {
  const { t } = useLingui();
  const resetGame = useResetGame();

  const startingArticle = useStartingArticle();
  const endingArticle = useEndingArticle();
  const history = useHistory();
  const lastArticle = history.length > 0 ? history.slice(-1)[0] : undefined;
  const clicks = useClicks();
  const isWin = useIsWin();
  const cheatingAttempts = useCheatingAttempts();
  const missedWins = history.slice(0, -2).reduce((acc, el) => acc + el.winningLinks, 0);

  // Dialog open state derives from the win plus an explicit dismissal, so no
  // effect is needed to sync state with the store.
  // winCount is the unique identity of the current win: history.length is not
  // (two different games can end with the same number of history entries).
  const winId = useWinCount();
  const [dismissedWinId, setDismissedWinId] = useState<number | null>(null);
  const open = isWin && dismissedWinId !== winId;
  const shareResult = () => {
    void (async () => {
      await navigator.clipboard.writeText(window.location.href);
      copyNotification(t({ id: "Copied to clipboard" }));
    })();
  };

  const resultStats = [
    { name: t({ id: "Article clicks" }), value: clicks },
    { name: t({ id: "Cheating attempts" }), value: cheatingAttempts },
    { name: t({ id: "Missed wins" }), value: missedWins },
  ];

  return (
    <>
      <ModalRoot
        open={open}
        onOpenChange={(nextOpen) => {
          // Reopening via the trigger must clear the dismissal of the current
          // win, or a dismissed dialog could never be brought back.
          setDismissedWinId(nextOpen ? null : winId);
        }}
      >
        <ModalTrigger asChild>
          {isWin && (
            <button type="button" className="p-4 hover:text-primary-blue sm:p-2">
              {t({ id: "Results" })}
            </button>
          )}
        </ModalTrigger>
        <ModalContent>
          <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border text-lg font-medium">
            {t({ id: "Results" })}
          </ModalTitle>
          <ModalDescription asChild>
            <StartArrowEnd
              className="mt-[10px] mb-5"
              startText={startingArticle.title}
              endText={endingArticle.title}
            />
          </ModalDescription>
          <table className="mb-5 w-full table-auto">
            <tbody>
              {resultStats.map((stat) => (
                <tr
                  key={stat.name}
                  className="even:bg-gray-200 dark:even:bg-dark-surface-secondary"
                >
                  <td className="py-2 pr-4">{stat.name}</td>
                  <td className="py-2 pr-4">{stat.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex-1 border-t-[1px] border-b-secondary-border pt-2 text-right">
            <StopwatchDisplay
              min={lastArticle?.time.min ?? ""}
              sec={lastArticle?.time.sec ?? ""}
              ms={lastArticle?.time.ms ?? ""}
            />
          </div>
          <div className="mt-9 flex flex-wrap justify-end gap-8">
            <button
              type="button"
              className="border-b-[1px] border-b-transparent hover:border-b-primary-blue focus-visible:border-b-primary-blue"
              onClick={shareResult}
            >
              {t({ id: "Share Result" })}
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-xs bg-secondary-blue px-5 py-3 hover:bg-primary-blue focus-visible:bg-primary-blue"
              >
                {t({ id: "Play again" })}
              </button>
            </Dialog.Close>
          </div>
        </ModalContent>
      </ModalRoot>
      {open && (
        <Portal.Root className="pointer-events-none fixed top-0 left-0 z-50 grid h-full w-full place-items-center">
          <VictoryConfetti />
        </Portal.Root>
      )}
    </>
  );
};

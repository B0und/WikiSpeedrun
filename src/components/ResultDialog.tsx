import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import {
  useCheatingAttempts,
  useClicks,
  useEndingArticle,
  useHistory,
  useIsWin,
  useStartingArticle,
} from "../GameStore";

import { StopwatchDisplay } from "./StopwatchDisplay";
import { ModalDisplay } from "./Dialog";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";
import { toast } from "react-hot-toast";

export const ResultDialog = () => {
  const { LL } = useI18nContext();
  const [open, setOpen] = useState(false);
  const resetGame = useResetGame();

  const startingArticle = useStartingArticle();
  const endingArticle = useEndingArticle();
  const history = useHistory();
  const [lastArticle] = history.slice(-1);
  const clicks = useClicks();
  const isWin = useIsWin();
  const cheatingAttempts = useCheatingAttempts();

  const copyNotification = () => toast.success(LL.LINK_COPIED(), { position: "top-center" });

  useEffect(() => {
    setOpen(isWin);
  }, [isWin]);

  const resultStats = [
    { name: LL.ARTICLE_CLICKS(), value: clicks },
    { name: LL.CHEATING_ATTEMPTS(), value: cheatingAttempts },
  ];

  return (
    <ModalDisplay
      descriptionNode={
        <p className="text-lg font-bold">
          {startingArticle.title} → {endingArticle.title}
        </p>
      }
      open={open}
      onOpenChange={setOpen}
      title={LL.RESULTS()}
      triggerNode={
        isWin && (
          <Dialog.Trigger asChild>
            <button className="p-4 hover:text-primary-blue sm:p-2">{LL.RESULTS()}</button>
          </Dialog.Trigger>
        )
      }
      contentNode={
        <>
          <table className="mb-5 w-full table-auto">
            <tbody>
              {resultStats.map((stat) => (
                <tr
                  key={`${stat.name}`}
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
              min={lastArticle?.time.min}
              sec={lastArticle?.time.sec}
              ms={lastArticle?.time.ms}
            />
          </div>

          <div className="mt-9 flex flex-wrap justify-end gap-8">
            <button
              className="border-b-[1px] border-b-transparent  hover:border-b-primary-blue focus-visible:border-b-primary-blue"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                copyNotification();
              }}
            >
              {LL.SHARE_RESULT()}
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-sm bg-secondary-blue px-5 py-3 hover:bg-primary-blue focus-visible:bg-primary-blue"
              >
                {LL.PLAY_AGAIN()}
              </button>
            </Dialog.Close>
          </div>
        </>
      }
    />
  );
};

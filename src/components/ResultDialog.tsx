import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import {
  useClicks,
  useEndingArticle,
  useHistory,
  useIsWin,
  useStartingArticle,
} from '../GameStore';

import { StopwatchDisplay } from './StopwatchDisplay';
import { DialogDisplay } from './Dialog';
import { useResetGame } from '../hooks/useResetGame';

export const ResultDialog = () => {
  const [open, setOpen] = useState(false);
  const resetGame = useResetGame();

  const startingArticle = useStartingArticle();

  const endingArticle = useEndingArticle();

  const history = useHistory();
  const [lastArticle] = history.slice(-1);
  const clicks = useClicks();
  const isWin = useIsWin();

  useEffect(() => {
    setOpen(isWin);
  }, [isWin]);

  const resultStats = [
    { name: 'Article clicks', value: clicks },
    { name: 'Missed wins', value: 140 },
    { name: 'Cheating attempts', value: 777 },
    { name: 'Achievements unlocked', value: 66 },
  ];

  return (
    <DialogDisplay
      descriptionNode={
        <>
          Speedrun from <span className="font-bold">{startingArticle}</span> to{' '}
          <span className="font-bold">{endingArticle}</span> complete.
        </>
      }
      open={open}
      onOpenChange={setOpen}
      title="Results"
      triggerNode={
        isWin && (
          <Dialog.Trigger asChild>
            <button className="">Results</button>
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

          <div className="mt-9 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-sm bg-secondary-blue px-5 py-3 hover:bg-primary-blue focus-visible:bg-primary-blue"
              >
                Play again
              </button>
            </Dialog.Close>
          </div>
        </>
      }
    />
  );
};

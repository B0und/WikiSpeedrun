import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'react-feather';
import {
  useClicks,
  useEndingArticle,
  useGameStoreActions,
  useHistory,
  useIsWin,
  useStartingArticle,
} from '../GameStore';

import { useNavigate } from 'react-router-dom';
import { useStopwatchActions } from './StopwatchContext';
import { StopwatchDisplay } from './StopwatchDisplay';
import { DialogDisplay } from './Dialog';

export const ResultDialog = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const startingArticle = useStartingArticle();
  const { resetGame } = useGameStoreActions();
  const endingArticle = useEndingArticle();
  const { reset } = useStopwatchActions();
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

          <div className="flex-1  border-t-[1px] border-b-secondary-border pt-2 text-right">
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
                onClick={() => {
                  resetGame();
                  reset();
                  navigate('/settings');
                }}
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Play again
              </button>
            </Dialog.Close>
          </div>
        </>
      }
    />
    // <Dialog.Root open={open} onOpenChange={setOpen}>
    // {isWin && (
    //   <Dialog.Trigger asChild>
    //     <button className="">Results</button>
    //   </Dialog.Trigger>
    // )}

    //   <Dialog.Portal>
    //     <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow" />
    //     <Dialog.Content className=" fixed top-[50%] left-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]  flex-col   rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:animate-contentShow dark:bg-dark-surface dark:text-dark-primary">
    //       <Dialog.Title className="m-0 border-b-[1px] border-b-secondary-border text-xl font-medium">
    //         Results
    //       </Dialog.Title>

    //       <Dialog.Description className="mt-[10px] mb-5 text-sm leading-normal">
    // Speedrun from <span className="font-bold">{startingArticle}</span> to{' '}
    // <span className="font-bold">{endingArticle}</span> complete.
    //       </Dialog.Description>

    // <table className="mb-5 w-full table-auto">
    //   <tbody>
    //     {resultStats.map((stat) => (
    //       <tr
    //         key={`${stat.name}`}
    //         className="even:bg-gray-200 dark:even:bg-dark-surface-secondary"
    //       >
    //         <td className="py-2 pr-4">{stat.name}</td>
    //         <td className="py-2 pr-4">{stat.value}</td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>

    // <div className="flex-1  border-t-[1px] border-b-secondary-border pt-2 text-right">
    //   <StopwatchDisplay
    //     min={lastArticle?.time.min}
    //     sec={lastArticle?.time.sec}
    //     ms={lastArticle?.time.ms}
    //   />
    // </div>

    // <div className="mt-9 flex justify-end">
    //   <Dialog.Close asChild>
    //     <button
    //       type="button"
    //       onClick={() => {
    //         resetGame();
    //         reset();
    //         navigate('/settings');
    //       }}
    //       className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
    //     >
    //       Play again
    //     </button>
    //   </Dialog.Close>
    // </div>
    //       <Dialog.Close asChild>
    //         <button
    //           className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full "
    //           aria-label="Close"
    //         >
    //           <X />
    //         </button>
    //       </Dialog.Close>
    //     </Dialog.Content>
    //   </Dialog.Portal>
    // </Dialog.Root>
  );
};

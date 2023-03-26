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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {isWin && (
        <Dialog.Trigger asChild>
          <button className="">Results</button>
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-dark-surface dark:text-dark-primary">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">You win!</Dialog.Title>
          <Dialog.Description className="mt-[10px] mb-5 text-[15px] leading-normal">
            From {startingArticle} to {endingArticle} in {clicks} clicks.
          </Dialog.Description>
          <StopwatchDisplay
            min={lastArticle?.time.min}
            sec={lastArticle?.time.sec}
            ms={lastArticle?.time.ms}
          />

          <div className="mt-[25px] flex justify-end">
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
          <Dialog.Close asChild>
            <button
              className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

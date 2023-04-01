import { DialogDisplay } from './Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import { useResetGame } from '../hooks/useResetGame';

export const GiveUpModal = () => {
  const resetGame = useResetGame();
  return (
    <DialogDisplay
      title="Confirm action"
      descriptionNode="If you leave, your current progress will be lost"
      triggerNode={
        <Dialog.Trigger asChild>
          <button>Give up</button>
        </Dialog.Trigger>
      }
      contentNode={
        <Dialog.Trigger asChild>
          <button
            className="w-fit self-end bg-secondary-blue px-4 py-2 hover:bg-primary-blue focus-visible:bg-primary-blue"
            onClick={resetGame}
          >
            Give up
          </button>
        </Dialog.Trigger>
      }
    />
  );
};

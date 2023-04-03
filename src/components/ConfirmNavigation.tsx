import { DialogDisplay } from "./Dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";

export const GiveUpModal = () => {
  const { LL } = useI18nContext();
  const resetGame = useResetGame();
  return (
    <DialogDisplay
      title={LL.CONFIRM_ACTION()}
      descriptionNode={LL.LEAVE_WARNING()}
      triggerNode={
        <Dialog.Trigger asChild>
          <button>{LL.GIVE_UP()}</button>
        </Dialog.Trigger>
      }
      contentNode={
        <Dialog.Trigger asChild>
          <button
            className="w-fit self-end bg-secondary-blue px-4 py-2 hover:bg-primary-blue focus-visible:bg-primary-blue"
            onClick={resetGame}
          >
            {LL.GIVE_UP()}
          </button>
        </Dialog.Trigger>
      }
    />
  );
};

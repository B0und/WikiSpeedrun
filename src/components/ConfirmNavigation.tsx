import { ModalDisplay } from "./Dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";

export const GiveUpModal = () => {
  const { LL } = useI18nContext();
  const resetGame = useResetGame();
  return (
    <ModalDisplay
      title={LL.CONFIRM_ACTION()}
      descriptionNode={LL.LEAVE_WARNING()}
      triggerNode={
        <Dialog.Trigger asChild>
          <button className="p-4 hover:text-primary-blue focus-visible:text-primary-blue sm:p-2">
            {LL.GIVE_UP()}
          </button>
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

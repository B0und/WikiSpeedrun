import { ModalContent, ModalDescription, ModalRoot, ModalTitle, ModalTrigger } from "./Modal";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";

export const GiveUpModal = () => {
  const { LL } = useI18nContext();
  const resetGame = useResetGame();
  return (
    <ModalRoot>
      <ModalTrigger asChild>
        <button className="p-4 hover:text-primary-blue focus-visible:text-primary-blue sm:p-2">
          {LL.GIVE_UP()}
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border text-lg font-medium">
          {LL.CONFIRM_ACTION()}
        </ModalTitle>
        <ModalDescription className="mb-5 mt-[10px] text-sm leading-normal">
          {LL.LEAVE_WARNING()}
        </ModalDescription>
        <ModalTrigger asChild>
          <button
            className="w-fit self-end bg-secondary-blue px-4 py-2 hover:bg-primary-blue focus-visible:bg-primary-blue"
            onClick={resetGame}
          >
            {LL.GIVE_UP()}
          </button>
        </ModalTrigger>
      </ModalContent>
    </ModalRoot>
  );
};

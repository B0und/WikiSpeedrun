import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";
import { ModalContent, ModalDescription, ModalRoot, ModalTitle, ModalTrigger } from "./Modal";

export const GiveUpModal = () => {
  const { LL } = useI18nContext();
  const resetGame = useResetGame();
  return (
    <ModalRoot>
      <ModalTrigger asChild>
        <button type="button" className="p-4 hover:text-primary-blue focus-visible:text-primary-blue sm:p-2">
          {LL["Give up"]()}
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border font-medium text-lg">
          {LL["Confirm action"]()}
        </ModalTitle>
        <ModalDescription className="mt-[10px] mb-5 text-sm leading-normal">
          {LL["If you leave, your current progress will be lost"]()}
        </ModalDescription>
        <ModalTrigger asChild>
          <button
            type="button"
            className="w-fit self-end bg-secondary-blue px-4 py-2 hover:bg-primary-blue focus-visible:bg-primary-blue"
            onClick={resetGame}
          >
            {LL["Give up"]()}
          </button>
        </ModalTrigger>
      </ModalContent>
    </ModalRoot>
  );
};

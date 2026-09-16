import { useResetGame } from "../hooks/useResetGame";
import { useLingui } from "@lingui/react/macro";
import { ModalContent, ModalDescription, ModalRoot, ModalTitle, ModalTrigger } from "./Modal";

export const GiveUpModal = () => {
  const { t } = useLingui();
  const resetGame = useResetGame();
  return (
    <ModalRoot>
      <ModalTrigger asChild>
        <button type="button" className="p-4 hover:text-primary-blue focus-visible:text-primary-blue sm:p-2">
          {t({ id: "Give up" })}
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border font-medium text-lg">
          {t({ id: "Confirm action" })}
        </ModalTitle>
        <ModalDescription className="mt-[10px] mb-5 text-sm leading-normal">
          {t({ id: "If you leave, your current progress will be lost" })}
        </ModalDescription>
        <ModalTrigger asChild>
          <button
            type="button"
            className="w-fit self-end bg-secondary-blue px-4 py-2 hover:bg-primary-blue focus-visible:bg-primary-blue"
            onClick={resetGame}
          >
            {t({ id: "Give up" })}
          </button>
        </ModalTrigger>
      </ModalContent>
    </ModalRoot>
  );
};

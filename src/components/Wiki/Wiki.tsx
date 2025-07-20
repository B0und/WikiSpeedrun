import { getRouteApi, useBlocker, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useEndingArticle, useGameStoreActions, useIsGameRunning, useStartingArticle } from "../../stores/GameStore";
import { ModalContent, ModalDescription, ModalRoot, ModalTitle } from "../Modal";
import { StartArrowEnd } from "../StartArrowEnd";
import { Stopwatch } from "../Stopwatch";
import { useNoCheating } from "./Wiki.utils";
import WikiDisplay from "./WikiDisplay";
import { useI18nContext } from "../../i18n/i18n-react";

export const wikiRoute = getRouteApi("/wiki/$");

const Wiki = () => {
  useNoCheating();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();
  const navigate = useNavigate();
  const isGameRunning = useIsGameRunning();
  const { resetStoreState } = useGameStoreActions();
  const { status, proceed, reset, next } = useBlocker({
    shouldBlockFn: ({ next }) => {
      return isGameRunning && !next.pathname.startsWith("/wiki");
    },
    withResolver: true,
  });

  useEffect(() => {
    if (!startArticle.title || !endArticle.title) {
      void navigate({ to: "/settings" });
    }
  }, [endArticle, navigate, startArticle]);

  const handleProceed = () => {
    if (next?.pathname && !next.pathname.startsWith("/wiki")) {
      resetStoreState();
    }
    if (proceed) {
      proceed();
    }
  };

  return (
    <>
      <div className="-mt-8">
        <div className="-top-8 sm:-top-4 sticky z-10 mb-2 bg-neutral-50 py-2 font-bold text-lg dark:bg-dark-surface">
          <StartArrowEnd startText={startArticle.title} endText={endArticle.title} />
        </div>
        <WikiDisplay />

        <div className="pointer-events-none absolute right-0 bottom-0 hidden overflow-hidden p-2 sm:flex">
          <div className="absolute inset-0 bg-black bg-opacity-80" />
          <Stopwatch />
        </div>
      </div>
      <WikiNavigationBlockModal open={status === "blocked"} onProceed={handleProceed} onCancel={reset} />
    </>
  );
};

function WikiNavigationBlockModal({
  open,
  onProceed,
  onCancel,
}: {
  open: boolean;
  onProceed: () => void;
  onCancel: (() => void) | undefined;
}) {
  const { LL } = useI18nContext();
  return (
    <ModalRoot open={open} onOpenChange={onCancel}>
      <ModalContent>
        <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border font-medium text-lg">
          Confirm action
        </ModalTitle>
        <ModalDescription className="mt-5 mb-5">
          {LL["If you leave, your current progress will be lost"]()}
        </ModalDescription>
        <div className="mt-9 flex flex-wrap justify-end gap-8">
          <button
            type="button"
            className="border-b-[1px] border-b-transparent hover:border-b-primary-blue focus-visible:border-b-primary-blue"
            onClick={onProceed}
          >
            {LL["Yes"]()}
          </button>
          <button
            type="button"
            className="rounded-sm bg-secondary-blue px-5 py-3 hover:bg-primary-blue focus-visible:bg-primary-blue"
            onClick={onCancel}
          >
            {LL["No"]()}
          </button>
        </div>
      </ModalContent>
    </ModalRoot>
  );
}

export default Wiki;

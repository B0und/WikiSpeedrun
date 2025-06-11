import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useEndingArticle, useStartingArticle } from "../../stores/GameStore";
import { StartArrowEnd } from "../StartArrowEnd";
import { Stopwatch } from "../Stopwatch";
import { useNoCheating } from "./Wiki.utils";
import WikiDisplay from "./WikiDisplay";

const Wiki = () => {
  useNoCheating();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();
  const navigate = useNavigate();

  useEffect(() => {
    if (!startArticle.title || !endArticle.title) {
      void navigate({ to: "/settings" });
    }
  }, [endArticle, navigate, startArticle]);

  return (
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
  );
};

export default Wiki;

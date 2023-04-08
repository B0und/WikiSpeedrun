import { useNavigate } from "react-router";
import { useEndingArticle, useStartingArticle } from "../../GameStore";

import WikiDisplay from "./WikiDisplay";
import { useEffect } from "react";
import { Stopwatch } from "../Stopwatch";

const Wiki = () => {
  const startTitle = useStartingArticle();
  const endTitle = useEndingArticle();
  const navigate = useNavigate();

  useEffect(() => {
    if (!startTitle || !endTitle) {
      navigate("/settings");
    }
  }, [endTitle, navigate, startTitle]);

  return (
    <div className="-mt-8">
      <div className="sticky -top-8 z-10 mb-2 bg-neutral-50 py-2 text-lg font-bold dark:bg-dark-surface sm:-top-4">
        {startTitle} → {endTitle}
      </div>
      <WikiDisplay />

      <div className="pointer-events-none absolute bottom-0  right-0  hidden overflow-hidden p-2 sm:flex">
        <div className="absolute inset-0  bg-black bg-opacity-80" />
        <Stopwatch />
      </div>
    </div>
  );
};

export default Wiki;

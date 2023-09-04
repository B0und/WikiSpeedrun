import { useNavigate } from "react-router";
import { useArticles, useTargetArticle } from "../../GameStore";

import WikiDisplay from "./WikiDisplay";
import { useEffect } from "react";
import { Stopwatch } from "../Stopwatch";
import { useNoCheating } from "./Wiki.utils";

const Wiki = () => {
  useNoCheating();
  const articles = useArticles();
  const navigate = useNavigate();

  useEffect(() => {
    if (articles.length === 0) {
      navigate("/settings");
    }
  }, [articles, navigate]);

  return (
    <div className="-mt-8">
      <div className="sticky -top-8 z-10 mb-2 bg-neutral-50 py-2 text-lg font-bold dark:bg-dark-surface sm:-top-4">
        {// list all the articles in the path with arrows in between
        articles.map((article, index) => {
          return (
            <span>
              <span className={index === useTargetArticle() ? "text-yellow-700 dark:text-yellow-300" : ""}>{article.title}</span>
              {index != articles.length - 1 && " → "}
            </span>
          );
        }
        )}
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

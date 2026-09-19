import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useLingui } from "@lingui/react/macro";
import { useHistory, useIsGameRunning } from "../stores/GameStore";

const HistoryTable = () => {
  const { t } = useLingui();
  const articleHistory = useHistory();
  const isGameRunning = useIsGameRunning();
  const navigate = useNavigate();

  const tableRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (articleHistory.length === 0) return;
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [articleHistory]);

  return (
    <div id="history-scroll" className="scrollbar self-stretch overflow-y-auto pr-3">
      <table className="mb-auto w-full table-auto">
        <caption className="text-start text-xl">{t({ id: "History" })}</caption>

        <thead className="sticky top-0 mt-2 h-9 bg-neutral-50 align-top dark:bg-dark-surface">
          <tr>
            <th className="text-start">{t({ id: "Article" })}</th>
            <th className="text-start">{t({ id: "Time" })}</th>
            {!isGameRunning && <th className="text-start">{t({ id: "Winning links" })}</th>}
          </tr>
        </thead>
        <tbody ref={tableRef}>
          {articleHistory.map((article) => (
            <tr
              key={`${article.title}${article.time.min}${article.time.sec}${article.time.ms}`}
              className="even:bg-gray-200 dark:even:bg-dark-surface-secondary"
            >
              {isGameRunning ? (
                <td className="py-2 pr-4">{article.title}</td>
              ) : (
                <td>
                  <button
                    type="button"
                    className="text-left text-primary-blue underline"
                    onClick={() => {
                      void navigate({
                        to: `/wiki/${encodeURIComponent(article.title.replaceAll(" ", "_"))}`,
                      });
                    }}
                  >
                    {article.title}
                  </button>
                </td>
              )}
              <td className="py-2 pr-4">
                {article.time.min}:{article.time.sec}.{article.time.ms}
              </td>
              {!isGameRunning && <td className="py-2 pr-4">{article.winningLinks}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;

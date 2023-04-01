import { useRef, useEffect } from 'react';
import { useHistory, useIsGameRunning } from '../GameStore';
import { useNavigate } from 'react-router';

const HistoryTable = () => {
  const articleHistory = useHistory();
  const isGameRunning = useIsGameRunning();
  const navigate = useNavigate();

  const tableRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    tableRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [articleHistory.length]);

  return (
    <div id="history-scroll" className="scrollbar self-stretch overflow-y-auto pr-3">
      <table className="mb-auto w-full table-auto">
        <caption className=" text-start text-xl">History</caption>

        <thead className="sticky top-0 mt-2 h-9 bg-neutral-50 align-top dark:bg-dark-surface">
          <tr>
            <th className="text-start">Article</th>
            <th className="text-start">Time</th>
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
                    className="text-primary-blue underline"
                    onClick={() => navigate(`/wiki/${article.title}`)}
                  >
                    {article.title}
                  </button>
                </td>
              )}
              <td className="py-2 pr-4">
                {article.time.min}:{article.time.sec}.{article.time.ms}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;

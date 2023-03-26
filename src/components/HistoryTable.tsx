import { useHistory } from '../GameStore';

const HistoryTable = () => {
  const articleHistory = useHistory();

  return (
    <div id="history-scroll" className="scrollbar self-stretch overflow-y-auto pr-3">
      <table className="mb-auto w-full table-auto">
        <caption className=" text-start text-xl">History</caption>

        <thead className="sticky top-0 h-9 bg-neutral-50 align-top mt-2 dark:bg-dark-surface">
          <tr>
            <th className="text-start">Article</th>
            <th className="text-start">Time</th>
          </tr>
        </thead>
        <tbody>
          {articleHistory.map((article) => (
            <tr
              key={`${article.title}${article.time.min}${article.time.sec}${article.time.ms}`}
              className="even:bg-gray-200 dark:even:bg-dark-surface-secondary"
            >
              <td className="py-2 pr-4">{article.title}</td>
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

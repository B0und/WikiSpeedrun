import { useEndingArticle, useStartingArticle } from '../../GameStore';

// import './wiki-common.css';

import WikiDisplay from './WikiDisplay';

const Wiki = () => {
  const startTitle = useStartingArticle();
  const endTitle = useEndingArticle();

  return (
    <div className="-mt-8">
      <div className="sticky -top-8 z-10 mb-2 bg-neutral-50 py-2 text-lg font-bold dark:bg-dark-surface">
        {startTitle} → {endTitle}
      </div>
      <WikiDisplay />
    </div>
  );
};

export default Wiki;

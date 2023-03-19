import { useEndingArticle, useStartingArticle } from '../../GameStore';

// import './wiki-common.css';

import WikiDisplay from './WikiDisplay';

const Wiki = () => {
  const startTitle = useStartingArticle();
  const endTitle = useEndingArticle();
  return (
    <div className="-mt-8">
      <div className="text-lg font-bold mb-2 bg-neutral-50 sticky -top-8 py-2 z-10">
        {startTitle} → {endTitle}
      </div>
      <WikiDisplay />
    </div>
  );
};

export default Wiki;

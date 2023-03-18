import { useEndingArticle, useStartingArticle } from '../../GameStore';

import './wiki-common.css';
import './wiki-vec2.css';
import WikiDisplay from './WikiDisplay';

const Wiki = () => {
  const startTitle = useStartingArticle();
  const endTitle = useEndingArticle();
  return (
    <div className="">
      <div className="text-lg font-bold mt-[-20px] mb-2">
        {startTitle} → {endTitle}
      </div>
      <WikiDisplay />
    </div>
  );
};

export default Wiki;

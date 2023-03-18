import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEndingArticle, useStartingArticle } from '../../GameStore';
import { WikiApiArticle } from './Wiki.types';

import './wiki-common.css';
import './wiki-vec2.css';
import WikiDisplay from './WikiDisplay';

interface WikiProps {
  startingArticle: string;
}

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

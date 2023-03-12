import React from 'react';
import { useI18nContext } from '../i18n/i18n-react';

const Test = () => {
  const { LL } = useI18nContext();
  return <div>{LL.HI({ name: 'vlad' })}</div>;
};

export default Test;

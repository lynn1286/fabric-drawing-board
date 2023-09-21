'use client';

import { useTranslations } from 'next-intl';

const Home = async () => {
  const t = useTranslations('Error');

  return <div>{t('title')}</div>;
};

export default Home;

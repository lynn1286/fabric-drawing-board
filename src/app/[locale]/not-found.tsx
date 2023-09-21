'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import notFound from '/public/notFound.svg';

export default function NotFound() {
  const t = useTranslations('Notfound');

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Image src={notFound} width={112} height={112} sizes="100%" priority alt={t('title')}></Image>
      <div className="mt-2 text-base font-semibold">{t('title')}</div>
    </div>
  );
}

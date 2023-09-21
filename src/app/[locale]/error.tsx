'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import InternalServerError from '@/public/InternalServerError.svg';

interface IError {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: IError) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Image
        src={InternalServerError}
        width={112}
        height={112}
        priority
        sizes="100%"
        alt={t('title')}
      ></Image>
      <div className="mt-2 text-base font-semibold">{t('title')}</div>
      <button
        onClick={() => reset()}
        type="button"
        className="mt-5 bg-black px-4 py-2 text-sm text-white"
      >
        {t('try')}
      </button>
    </div>
  );
}

import './design.css';

import { notFound } from 'next/navigation';
import { createTranslator } from 'next-intl';
import Header from '@/app/components/header';

async function getMessages(locale: string) {
  try {
    return (await import(`/messages/${locale}.json`)).default;
  } catch (error) {
    return notFound();
  }
}

export async function generateMetadata({ params: { locale } }: RootLayout) {
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, messages });

  return {
    title: t('Design.title'),
  };
}

export default async function RootLayout({ children }: RootLayout) {
  return (
    <div className="h-screen">
      <Header></Header>
      {children}
    </div>
  );
}

import { notFound } from 'next/navigation';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { inter, roboto_mono } from '../utils/fonts';

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
    title: t('Home.title'),
  };
}

export default async function RootLayout({ children, params: { locale } }: RootLayout) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

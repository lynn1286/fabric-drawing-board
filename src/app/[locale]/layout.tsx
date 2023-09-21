import { ConfigProvider } from 'antd';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import theme from '@/theme/themeConfig';
import StyledComponentsRegistry from '../components/AntdRegistry';
import { inter, roboto_mono } from '../utils/fonts';

async function getMessages(locale: string) {
  try {
    return (await import(`/messages/${locale}.json`)).default;
  } catch (error) {
    return notFound();
  }
}

async function getAntdMessages(locale: string) {
  const locals: Record<string, string> = {
    'zh-cn': 'zh_CN',
    en: 'en_US',
  };

  try {
    return (await import(`antd/locale/${locals[locale]}`)).default;
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
  const antMessages = await getAntdMessages(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StyledComponentsRegistry>
            <ConfigProvider theme={theme} locale={antMessages}>
              {children}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

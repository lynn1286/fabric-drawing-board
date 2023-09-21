'use server';

import { cookies } from 'next/headers';

/**
 * @description: 获取语种
 * @return {*}
 */
export const getLocale = () => {
  // 文档： https://nextjs.org/docs/pages/building-your-application/routing/internationalization#leveraging-the-next_locale-cookie
  return cookies().get('NEXT_LOCALE')?.value;
};

import { createTranslator } from 'next-intl';
import { getLocale } from './getLocale';

/**
 * @description: 用于服务端国际化
 * @param {string} namespace
 * @param {string} key
 * @return {*}
 */
export const getTranslation = async (namespace: string, key: string) => {
  // 从 cookie 中读取语种, bug： cookie 更改后获取的是旧值，解决： 需要刷新页面
  const locale = getLocale() ?? 'zh-cn';
  const messages = (await import(`/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace });
  return t(key);
};

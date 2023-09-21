'use client';

import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, message } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import Logo from '/public/next.svg';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import { useTransition } from 'react';

const currentLocale: Record<string, string> = {
  en: 'En',
  'zh-cn': '中文',
};

const Header = () => {
  const router = useRouter();

  const t = useTranslations('Design');
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const locale = useLocale();

  const items: MenuProps['items'] = [
    {
      label: '复制到剪切板',
      key: '1',
    },
    {
      label: '保存为图片',
      key: '2',
    },
    {
      label: '保存为SVG',
      key: '3',
    },
    {
      type: 'divider',
    },
    {
      label: '保存为JSON',
      key: '4',
    },
  ];

  /**
   * @description: 保存
   * @param {*} e
   * @return {*}
   */
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  /**
   * @description: 语种切换
   * @param {*} e
   * @return {*}
   */
  const handleSelectLocale: MenuProps['onClick'] = (e) => {
    startTransition(() => {
      router.replace(pathname, { locale: e.key });
    });
  };

  return (
    <div
      className={clsx(
        'flex h-11 items-center justify-between border border-b border-gray-300 px-3',
      )}
    >
      <span className="relative mr-3 inline-block h-8 w-8 text-center align-middle">
        <Image src={Logo} priority fill alt="logo" className="absolute left-0 top-0" />
      </span>
      <Space>
        <Button type="link" size="small">
          {t('header.preview')}
        </Button>
        <Button type="link" size="small">
          {t('header.clear')}
        </Button>
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}
        >
          <Button>
            <Space>
              {t('header.save')}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: [
              {
                label: '中文',
                key: 'zh-cn',
              },
              {
                label: 'En',
                key: 'en',
              },
            ],
            onClick: handleSelectLocale,
          }}
        >
          <Button type="link">
            <Space>
              {currentLocale[locale]}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Header;

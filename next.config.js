/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false, // 关掉react严格模式下的渲染2次的问题
  webpack: (config) => {
    config.externals = [
      ...config.externals,
      {
        canvas: 'canvas',
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        indexof: 'indexof',
      },
    ];
    return config;
  },
};

module.exports = nextConfig;

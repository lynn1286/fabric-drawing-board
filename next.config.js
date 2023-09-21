/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
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

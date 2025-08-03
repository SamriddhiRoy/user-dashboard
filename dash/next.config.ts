import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  webpack: (config) => {
    config.externals.push({
      '@neondatabase/serverless': '@neondatabase/serverless',
    })
    return config
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  serverExternalPackages: ['@neondatabase/serverless'],
  webpack: (config) => {
    config.externals.push({
      '@neondatabase/serverless': '@neondatabase/serverless',
    })
    return config
  },
};

export default nextConfig;

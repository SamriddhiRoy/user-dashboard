import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  webpack: (config) => {
    config.externals.push({
      '@neondatabase/serverless': '@neondatabase/serverless',
    })
    return config
  },
};

export default nextConfig;

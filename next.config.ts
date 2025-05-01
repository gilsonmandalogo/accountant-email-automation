import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  output: 'standalone',
  serverExternalPackages: ['vendus-export'],
};

export default nextConfig;

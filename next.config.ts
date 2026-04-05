import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.BUILD_TARGET === 'web' ? '/paw-log' : '',
  images: { unoptimized: true },
};

export default nextConfig;

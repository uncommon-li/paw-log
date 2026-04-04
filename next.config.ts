import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/paw-log',
  images: { unoptimized: true },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  // Improve performance by disabling x-powered-by header
  poweredByHeader: false,
  // Configure CORS headers if needed
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_API_URL || '*',
          },
        ],
      },
    ];
  },
  // Temporarily ignore ESLint errors during build
  eslint: {
    // Warning instead of error for production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import type { NextConfig } from 'next';
import path from 'path';

console.log('NextConfig: NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Output file tracing root (moved from experimental in Next.js 15)
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Compress responses
  compress: true,

  // SWC minification is enabled by default in Next.js 15
  // swcMinify: true, // Deprecated

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Transpile shared packages from monorepo
  transpilePackages: [
    '@cnarsugu/types',
    '@cnarsugu/schemas',
    '@cnarsugu/store',
    '@cnarsugu/hooks',
    '@cnarsugu/utils',
  ],

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@cnarsugu/store', '@cnarsugu/hooks'],
  },

  // Configure headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache product pages with revalidation
        source: '/(auto-prestige|moto|multirisk-pro|iac)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Configure rewrites for API proxy (optional)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
};

export default nextConfig;

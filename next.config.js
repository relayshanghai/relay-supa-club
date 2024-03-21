/* eslint-disable @typescript-eslint/no-var-requires */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    typescript: {
        tsconfigPath: './tsconfig.build.json',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yt3.*.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'imgp.*.icu',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '*.tiktokcdn.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'image-cache.brainchild-tech.cn',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'image-cache.relay.club',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'quwgcjfxxojrvkenqgmi.supabase.co',
                pathname: '**',
            },
        ],
    },
    async rewrites() {
        return [
          {
            // proxy to supabase storage
            source: '/storage/v1/:path*',
            destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/:path*` // Proxy to Backend
          }
        ]
      },
      experimental: {
        instrumentationHook: true
      }
};

module.exports = nextConfig;

module.exports = withSentryConfig(module.exports, { silent: true }, {});


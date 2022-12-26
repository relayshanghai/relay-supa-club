/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yt3.*.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'imgp.*.icu',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: '*.tiktokcdn.com',
                pathname: '**'
            }
        ]
    }
};

module.exports = nextConfig;

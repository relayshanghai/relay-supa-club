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
            },
            {
                protocol: 'https',
                hostname: 'image-cache.brainchild-tech.cn',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'quwgcjfxxojrvkenqgmi.supabase.co',
                pathname: '**'
            }
        ]
    }
};

module.exports = nextConfig;

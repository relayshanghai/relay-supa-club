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
            }
        ]
    }
};

module.exports = nextConfig;

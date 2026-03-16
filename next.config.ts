import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,

    output: 'standalone',

    compiler: {
        styledComponents: true,
    },
    experimental: {
        serverMinification: false,
    },
};

export default nextConfig;

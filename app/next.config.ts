import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xqshkiygkyxadksvggks.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.stability.ai',
            }
        ],
    },
    experimental: {
        // Disable server actions body size limit if needed for large uploads, 
        // but Keeping it default for security unless requested.
    },
    // Ensure development mode doesn't crash on hydration mismatches from social widgets
    reactStrictMode: true,
};

export default nextConfig;

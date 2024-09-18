/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "img.clerk.com",
        }, ],
    },
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: false
    }
};

export default nextConfig;
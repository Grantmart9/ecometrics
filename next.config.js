/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ["images.unsplash.com", "via.placeholder.com"],
        unoptimized: true, // Add this for static export
    },
    // Conditionally set output based on environment
    ...(process.env.NODE_ENV === 'production' ? {
        output: 'export',
        trailingSlash: true, // Add trailing slashes for better CPanel compatibility
    } : {}),
    // Only add rewrites in development (not for static export)
    ...(process.env.NODE_ENV !== 'production' ? {
        async rewrites() {
            return [
                {
                    source: '/api/:path*',
                    destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
                },
            ];
        },
    } : {}),
};

module.exports = nextConfig;
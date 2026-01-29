/** @type {import('next').NextConfig} */
const nextConfig = {
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.temo.co.za/advice/dev';
            console.log('API URL for rewrites:', apiUrl);
            return [
                {
                    source: '/api/:path*',
                    destination: apiUrl + '/:path*',
                },
            ];
        },
    } : {}),
};

module.exports = nextConfig;
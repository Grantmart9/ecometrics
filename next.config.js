/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://api.temo.co.za/advice/dev/:path*",
            },
            {
                source: "/temo-api/:path*",
                destination: "https://api.temo.co.za/:path*",
            },
        ];
    },
}

module.exports = nextConfig

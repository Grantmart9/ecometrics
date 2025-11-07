/** @type {import('next').NextConfig} */
const nextConfig = {
    // For server deployment (EC2) - no output: 'export'
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ['images.unsplash.com', 'via.placeholder.com'],
    },
}

module.exports = nextConfig

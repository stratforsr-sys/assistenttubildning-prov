/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // Optimeringar för Vercel
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig

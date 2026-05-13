/** @type {import('next').NextConfig} */
// Forced trigger for fresh Vercel deployment
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

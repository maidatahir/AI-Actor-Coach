/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Prevents Mongoose from being bundled by webpack (it uses native add-ons)
    serverComponentsExternalPackages: ["mongoose"],
  },
}

export default nextConfig

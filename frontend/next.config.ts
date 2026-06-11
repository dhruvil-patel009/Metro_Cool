import { NextConfig } from "next/dist/server/config-shared"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    // `domains` removed — use remotePatterns only (no deprecation warning)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nlimsceezdxwkykpzlbv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nlimsceezdxwkykpzlbv.supabase.co"],
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
    ],
  },
};

module.exports = nextConfig;

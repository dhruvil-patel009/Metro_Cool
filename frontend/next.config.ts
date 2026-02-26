// import type { NextConfig } from "next";

import { NextConfig } from "next/dist/server/config-shared";
import { hostname } from "os";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig: NextConfig  = {
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
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      }
    ],
  },
};

export default nextConfig;

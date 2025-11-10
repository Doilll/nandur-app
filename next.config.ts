import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: process.env.HOST_BLOB_URL!,
      }
    ],
  },
  reactCompiler: true,
};

export default nextConfig;

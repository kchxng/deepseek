import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: "/en",
  //       destination: "/",
  //       permanent: true, // use false for temporary (302)
  //     },
  //   ];
  // },
  /* config options here */
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.0.107:3000",
    "*.local-origin.dev",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "192.168.0.107:3000",
        "*app.localhost:3000",
      ],
    },
  },
  // crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow any hostname
      },
      {
        protocol: "http",
        hostname: "**", // also allow http if needed
      },
    ],
  },
};

export default nextConfig;

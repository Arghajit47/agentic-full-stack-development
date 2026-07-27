import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/about",
      destination: "/about-us",
      permanent: true,
    },
  ],
};

export default nextConfig;

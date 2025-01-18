import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "@react-pdf/renderer"],
    esmExternals: "loose"
  },
};

export default nextConfig;

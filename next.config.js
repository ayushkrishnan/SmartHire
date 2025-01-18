const nextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "@react-pdf/renderer"],
    esmExternals: "loose"
  },
};
module.exports = nextConfig
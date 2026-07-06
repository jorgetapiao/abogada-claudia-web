import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // CDN de Bunny.net (Pull Zone). Ajustá el hostname si tu zona usa un
        // dominio distinto; b-cdn.net es el patrón por defecto.
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aktifkan kompresi gzip/brotli untuk semua response
  compress: true,
  // Hapus header X-Powered-By (minor security + perf)
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Optimasi tree-shaking untuk library besar
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-icons"],
  },
};

export default nextConfig;

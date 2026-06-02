import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    localPatterns: [
      { pathname: "/uploads/**", search: "" },
      { pathname: "/images/**", search: "" },
    ],
  },
};

export default nextConfig;

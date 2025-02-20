import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["example.com"],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

export default withNextVideo(nextConfig);
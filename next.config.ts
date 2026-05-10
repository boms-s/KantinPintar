import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "localhost:3000"
  ]
};  

export default nextConfig;

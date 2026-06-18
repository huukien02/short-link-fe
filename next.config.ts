import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất bản standalone để Docker image gọn (chỉ copy file cần thiết)
  output: "standalone",
};

export default nextConfig;

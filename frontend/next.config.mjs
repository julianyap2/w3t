/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "build",
  staticPageGenerationTimeout: 180,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;

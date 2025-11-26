/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Enable SWC transform for styled-components to improve SSR compatibility
  compiler: {
    styledComponents: true,
  },
  experimental: {
    turbo: false,
  },
};

export default nextConfig;

// import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/charts",
      "@mantine/dates",
      "@mantine/dropzone",
      "@mantine/hooks",
      "@mantine/modals",
      "@mantine/notifications",
      "@mantine/tiptap",
      "next-auth",
    ],
  },
  output: "standalone",
};

// export default withBundleAnalyzer(nextConfig);
export default nextConfig;

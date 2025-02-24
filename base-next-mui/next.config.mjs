// import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@mui/x-data-grid",
      "@mui/x-date-pickers",
      "@mui/x-charts",
      "@mui/material-nextjs",
      "next-auth",
    ],
  },
  transpilePackages: ["mui-chips-input"],
  modularizeImports: {
    "@mui/material/!(styles)/?*": {
      transform: "@mui/material/{{path}}/{{member}}",
      skipDefaultConversion: true,
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  output: "standalone",
};

// export default withBundleAnalyzer(nextConfig);
export default nextConfig;

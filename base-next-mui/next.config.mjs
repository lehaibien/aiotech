// import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "localhost",
      //   port: "5555",
      //   pathname: "/static/images/**",
      // },
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "5554",
      //   pathname: "/static/images/**",
      // },
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "3000",
      //   pathname: "/**",
      // },
      {
        protocol: "http",
        hostname: "**"
      },
      {
        protocol: "https",
        hostname: "**"
      }
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

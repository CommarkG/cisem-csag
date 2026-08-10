import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    ignoreIssue: [
      {
        path: /.*/,
        title: /Encountered unexpected file in NFT list/,
      },
    ],
  },
};

export default nextConfig;



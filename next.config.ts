import type { NextConfig } from "next";
// Import the patched plugin
// @ts-ignore - Using require as it might not have TS types
const { PyodidePlugin } = require("@pyodide/webpack-plugin");

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      }
    ]
  },

  // Add headers for Cross-Origin Isolation
  async headers() {
    return [
      {
        source: '/:path*', // Apply to all routes
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          // Updated CSP: Added avatar.vercel.sh to img-src and repo.r-wasm.org to connect-src
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://cdn.jsdelivr.net; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; worker-src 'self' blob:; img-src 'self' https://cdn.jsdelivr.net data: https://avatar.vercel.sh; child-src blob:; connect-src 'self' https://cdn.jsdelivr.net https://*.supabase.co https://repo.r-wasm.org;"
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Update webpack configuration based on the article
  webpack: (config, { isServer }) => {
    // Base experiments for WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };
    
    if (!isServer) {
      // Add Pyodide plugin only for the client bundle
      config.plugins.push(new PyodidePlugin());
      // Prevent bundling node-fetch on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        "node-fetch": false,
      };
    } else {
      // Mark pyodide as external for the server bundle
      config.externals = ["pyodide", ...(config.externals || [])];
    }
    
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: frontendDir,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.alias["node:fs"] = false;
      config.resolve.alias["node:path"] = false;
      config.resolve.alias["node:stream"] = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.path = false;
      config.resolve.fallback.stream = false;
    }
    return config;
  },
};

export default nextConfig;

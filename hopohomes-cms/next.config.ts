
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set output file tracing root to the monorepo root
  outputFileTracingRoot: path.join(__dirname, ".."),
  // Enable standalone output for Docker
  output: 'standalone',

  // Skip TypeScript errors during Docker build
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.slaab.ai',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'docs.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Supabase Storage - matches any Supabase project
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Limit concurrency for Docker builds to prevent OOM
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;

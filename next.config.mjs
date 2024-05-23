import withBundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const pwaConfig = {
  dest: 'public',
  // Add your PWA options here
};

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(new NodePolyfillPlugin());

      // Polyfill for 'worker_threads' and other Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        worker_threads: false,
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        process: require.resolve('process/browser'),
      };

      // Handle node: scheme URIs
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }));
    }

    // Ensure Webpack handles node: URIs
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        buffer: 'buffer',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.node'],
    };

    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false, // disable the behavior
      },
    });

    return config;
  },
};

export default bundleAnalyzer(withPWA(nextConfig));

import withBundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import fetch from 'node-fetch';

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

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // graceful-fs not needed on client-side
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        constants: require.resolve('constants-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: false, // os-browserify not needed on client-side
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util'),
        net: false, // net not needed on client-side
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }),
      );

      config.ignoreWarnings = [/Failed to parse source map/];

      config.module.rules.push({
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        loader: require.resolve('source-map-loader'),
        resolve: {
          fullySpecified: false,
        },
      });
    }
    
    return config;
  },
};

export default bundleAnalyzer(withPWA(nextConfig));

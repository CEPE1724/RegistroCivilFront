/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Agregar fallbacks solo si no es el servidor
      if (!isServer) {
        config.resolve.fallback = {
          "fs": false,
          "stream": require.resolve("stream-browserify"),
          "zlib": require.resolve("browserify-zlib"),
        };
      }
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  
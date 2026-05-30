/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.+\/_next\/static\/.+/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-static-assets",
        networkTimeoutSeconds: 4,
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
    {
      urlPattern: /^https?:\/\/.+\.(?:png|jpg|jpeg|svg|webp|avif|ico)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-images",
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.firebasestorage.googleapis.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withPWA(nextConfig);

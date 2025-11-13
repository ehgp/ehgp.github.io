/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  turbopack: {
    root: "./",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "github-readme-stats.vercel.app" },
      {
        protocol: "https",
        hostname: "github-readme-streak-stats.herokuapp.com",
      },
      { protocol: "https", hostname: "img.shields.io" },
      { protocol: "https", hostname: "visitor-badge.laobi.icu" },
      { protocol: "https", hostname: "wakatime.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
};

export default nextConfig;

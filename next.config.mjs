/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Static HTML export — compatible with Cloudflare Pages (no Node server). */
  output: "export",
  /** Directory-style output (`/date/index.html`) matches Cloudflare Pages routing. */
  trailingSlash: true,
};

export default nextConfig;

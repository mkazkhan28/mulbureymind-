/** @type {import('next').NextConfig} */
const nextConfig = {
  // Style checks (ESLint) run in the editor; they should not block a deployment.
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    // pdfjs-dist (book reader) optionally requires the Node "canvas" package; it is not needed in the browser.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;

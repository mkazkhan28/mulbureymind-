/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // pdfjs-dist (book reader) optionally requires the Node "canvas" package; it is not needed in the browser.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;

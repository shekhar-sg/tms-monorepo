const configuredApiUrl = process.env.API_URL?.trim();
if (process.env.VERCEL && !configuredApiUrl) {
  throw new Error(
    "Set API_URL in the frontend Vercel project to the public HTTPS backend origin, then redeploy."
  );
}
const apiUrl = new URL(configuredApiUrl || "http://localhost:4000");
if (
  !["http:", "https:"].includes(apiUrl.protocol) ||
  (process.env.VERCEL &&
    (apiUrl.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "[::1]"].includes(apiUrl.hostname)))
) {
  throw new Error("API_URL must point to a public HTTPS backend on Vercel.");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl.href.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;

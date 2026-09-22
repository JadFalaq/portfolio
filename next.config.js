/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Pin the build root to this project — without this, Next.js walks up the
  // filesystem looking for lockfiles and can pick the wrong workspace root
  // if a sibling/parent folder happens to contain one (as on this machine).
  outputFileTracingRoot: __dirname,
  images: {
    // Vercel's built-in Image Optimization (safe since Next.js >= 15.5.24,
    // which patches the AVIF image-optimizer RCE). Public assets are large
    // source photos/screenshots — letting Next resize/compress them for the
    // actual rendered size meaningfully cuts page weight.
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

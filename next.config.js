/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          // Content Security Policy - Protects against XSS, clickjacking, and other code injection attacks
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-inline and unsafe-eval
              "style-src 'self' 'unsafe-inline'", // Allow inline styles for styled-components, Tailwind, etc.
              "img-src 'self' data: blob: https:", // Allow images from HTTPS sources and data URIs
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co", // Supabase API and realtime
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'", // Prevents your site from being embedded in iframes (clickjacking protection)
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // Prevents browsers from incorrectly detecting non-scripts as scripts
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Prevents your site from being embedded in iframes (clickjacking protection)
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Controls how much referrer information should be included with requests
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Controls which browser features and APIs can be used
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "interest-cohort=()", // Disables FLoC
            ].join(", "),
          },
          // HTTP Strict Transport Security - Forces HTTPS
          // Note: Vercel already sets this, but we include it for completeness
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Enable DNS prefetch
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      // Separate headers for shader embed routes (used in iframes)
      {
        source: "/shaders/:path*/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors *", // Allow embedding from any domain for shader embeds
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // Allow embedding for shader embeds
          },
        ],
      },
    ];
  },
};

export default config;

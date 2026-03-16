import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://*.razorpay.com https://*.vercel-scripts.com https://vercel.live`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https: http:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.razorpay.com https://api.razorpay.com https://*.supabase.co https://*.vercel-insights.com https://vercel.live wss://vercel.live https://*.your-objectstorage.com",
            "frame-src 'self' https://api.razorpay.com https://*.razorpay.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ],
  images: {
    qualities: [25, 50, 75],
    formats: ["image/webp"],
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "focncjvcgoyolzlrobli.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "zecurx-web.fsn1.your-objectstorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shop.hak5.org",
        port: "",
        pathname: "/cdn/**",
      },
    ],
  },
};

export default nextConfig;

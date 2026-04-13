import { withSentryConfig } from '@sentry/nextjs';

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.youtube.com *.twitter.com https://www.googletagmanager.com https://www.google-analytics.com;
  child-src 'self' *.youtube.com *.google.com *.twitter.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'self' blob: data: *.youtube.com;
  connect-src 'self'
    https://*.ingest.sentry.io
    https://*.ingest.us.sentry.io
    https://*.googleapis.com
    https://*.firebaseio.com
    https://*.firebase.google.com
    https://firestore.googleapis.com
    https://identitytoolkit.googleapis.com
    https://securetoken.googleapis.com
    https://generativelanguage.googleapis.com
    https://www.google-analytics.com
    https://analytics.google.com
    https://stats.g.doubleclick.net
    wss://*.firebaseio.com;
  font-src 'self' data: *.googleapis.com *.gstatic.com;
  worker-src 'self' blob:;
`;


const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(self), geolocation=()',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];


const nextConfig = {
  poweredByHeader: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.output = {
        ...config.output,
        chunkLoadTimeout: 180000,
      };
    }
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /require-in-the-middle/ },
    ];
    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  devIndicators: {
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') return [];
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;

/*
export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "fitcv",
    project: "fitcv",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
*/

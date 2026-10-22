import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // widths the srcset can pick from: phones at 2x/3x (640, 828, 1080, 1200), tablets, laptops, desktops and 2K/4K screens
    deviceSizes: [480, 640, 828, 1080, 1200, 1440, 1920, 2560],
    qualities: [75, 80],
    // photos in /public rarely change, so keep optimized variants for 30 days instead of the default 4 hours
    // (after replacing an image under the same name, clear .next/cache/images)
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // mongoose must stay out of the bundle so Next doesn't try to trace its optional drivers
  serverExternalPackages: ['mongoose'],
  poweredByHeader: false,
  async headers() {
    // files in /public are served with max-age=0 by default; let browsers keep them for a day and refresh in the background
    const cacheable = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }];
    return [
      { source: '/images/:path*', headers: cacheable },
      { source: '/videos/:path*', headers: cacheable },
    ];
  },
};

export default config;

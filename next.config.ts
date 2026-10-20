import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1080, 1440, 1920, 2560],
    qualities: [75, 90],
  },
  // mongoose must stay out of the bundle so Next doesn't try to trace its optional drivers
  serverExternalPackages: ['mongoose'],
  poweredByHeader: false,
};

export default config;

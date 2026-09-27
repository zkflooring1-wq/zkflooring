import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZK Flooring Birmingham',
    short_name: 'ZK Flooring',
    description: 'Premium Carpet, Wood, LVT & Commercial Flooring Specialists in Birmingham',
    start_url: '/',
    display: 'standalone',
    background_color: '#16120B',
    theme_color: '#D4AF37',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

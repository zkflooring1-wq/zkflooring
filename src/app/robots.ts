import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/admin-login.php', '/api/admin/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Amazonbot',
          'Applebot',
          'cohere-ai',
          'OAI-SearchBot',
          'Meta-ExternalAgent',
        ],
        allow: ['/', '/llms.txt', '/llm.txt', '/llms-full.txt'],
        disallow: ['/admin', '/admin/', '/admin-login.php', '/api/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

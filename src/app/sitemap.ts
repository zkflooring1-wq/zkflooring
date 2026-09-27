import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { supabase } from '@/lib/supabase';
import { defaultZkServices } from '@/components/ServicesSection';
import { defaultProjects } from '@/data/projectsData';
import { blogPosts } from '@/data/blogPosts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ];

  // 2. Dynamic Services
  let serviceSlugs = defaultZkServices.map(s => s.slug);
  try {
    const { data: dbServices } = await supabase.from('services').select('slug, updated_at');
    if (dbServices && dbServices.length > 0) {
      const dbSlugs = dbServices.map(s => s.slug).filter(Boolean);
      serviceSlugs = Array.from(new Set([...serviceSlugs, ...dbSlugs]));
    }
  } catch (e) {
    // Fallback to default
  }

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map(slug => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Dynamic Projects
  let projectSlugs = defaultProjects.map(p => p.slug);
  try {
    const { data: dbProjects } = await supabase.from('projects').select('slug, updated_at');
    if (dbProjects && dbProjects.length > 0) {
      const dbSlugs = dbProjects.map(p => p.slug).filter(Boolean);
      projectSlugs = Array.from(new Set([...projectSlugs, ...dbSlugs]));
    }
  } catch (e) {
    // Fallback
  }

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map(slug => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // 4. Dynamic Blog Posts
  let blogSlugs = blogPosts.map(b => b.slug);
  try {
    const { data: dbPosts } = await supabase.from('posts').select('slug, updated_at').eq('status', 'published');
    if (dbPosts && dbPosts.length > 0) {
      const dbSlugs = dbPosts.map(p => p.slug).filter(Boolean);
      blogSlugs = Array.from(new Set([...blogSlugs, ...dbSlugs]));
    }
  } catch (e) {
    // Fallback
  }

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
}

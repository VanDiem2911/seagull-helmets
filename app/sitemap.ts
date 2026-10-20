import type { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import { ArticleModel, ProductModel } from '@/lib/models';
import { policySlugs } from '@/lib/policies';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['vi', 'en'] as const;
  const entry = (path: string, priority: number, lastModified?: Date): MetadataRoute.Sitemap =>
    locales.map((l) => ({
      url: `${site.url}/${l}${path}`,
      lastModified,
      priority,
      alternates: { languages: { vi: `${site.url}/vi${path}`, en: `${site.url}/en${path}` } },
    }));

  let products: { slug: string; updatedAt?: Date }[] = [];
  let articles: { slug: string; updatedAt?: Date }[] = [];
  try {
    await connectDB();
    [products, articles] = await Promise.all([
      ProductModel.find({ active: true }).select('slug updatedAt').lean<any[]>(),
      ArticleModel.find({ published: true }).select('slug updatedAt').lean<any[]>(),
    ]);
  } catch {}

  return [
    ...entry('', 1),
    ...entry('/products', 0.9),
    ...entry('/collections', 0.7),
    ...entry('/journal', 0.7),
    ...entry('/about', 0.5),
    ...entry('/stores', 0.6),
    ...policySlugs.flatMap((s) => entry(`/policies/${s}`, 0.3)),
    ...products.flatMap((p) => entry(`/products/${p.slug}`, 0.8, p.updatedAt)),
    ...articles.flatMap((a) => entry(`/journal/${a.slug}`, 0.6, a.updatedAt)),
  ];
}

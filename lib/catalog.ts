import 'server-only';
import { connectDB, plain } from './db';
import { ProductModel, ArticleModel, ReviewModel } from './models';
import { colorFamilies, helmetTypes, ridingStyles, type Product } from './types';

export type ProductQuery = {
  type?: string;
  style?: string;
  color?: string;
  size?: string;
  price?: string; // "min-max"
  sort?: string;
  q?: string;
  page?: number;
  perPage?: number;
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function getProducts(query: ProductQuery) {
  await connectDB();
  const filter: Record<string, unknown> = { active: true };
  if (query.type && (helmetTypes as readonly string[]).includes(query.type)) filter.type = query.type;
  if (query.style && (ridingStyles as readonly string[]).includes(query.style)) filter.styles = query.style;
  if (query.color && (colorFamilies as readonly string[]).includes(query.color)) filter['colors.family'] = query.color;
  if (query.size && /^[A-Za-z0-9]{1,4}$/.test(query.size)) filter.sizes = query.size;
  const m = query.price?.match(/^(\d+)-(\d+)$/);
  if (m) filter.price = { $gte: Number(m[1]), $lte: Number(m[2]) };
  const q = query.q?.trim().slice(0, 60);
  if (q) {
    const re = new RegExp(escapeRe(q), 'i');
    filter.$or = [{ 'name.vi': re }, { 'name.en': re }, { code: re }, { slug: re }, { 'colors.name.vi': re }, { 'colors.name.en': re }];
  }

  const sorts: Record<string, Record<string, 1 | -1>> = {
    newest: { sortOrder: 1, createdAt: -1 },
    bestseller: { bestscore: -1, sortOrder: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };
  const sort = query.sort ?? 'newest';
  const perPage = query.perPage ?? 9;
  const page = Math.max(1, query.page ?? 1);

  let cursor;
  if (sort === 'bestseller') {
    // bestsellers first, then by sortOrder
    const [items, total] = await Promise.all([
      ProductModel.aggregate([
        { $match: filter },
        { $addFields: { bestscore: { $cond: [{ $in: ['bestseller', { $ifNull: ['$badges', []] }] }, 1, 0] } } },
        { $sort: sorts.bestseller },
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ]),
      ProductModel.countDocuments(filter),
    ]);
    return { items: plain<Product[]>(items), total, page, pages: Math.max(1, Math.ceil(total / perPage)) };
  }
  cursor = ProductModel.find(filter)
    .sort(sorts[sort] ?? sorts.newest)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();
  const [items, total] = await Promise.all([cursor, ProductModel.countDocuments(filter)]);
  return { items: plain<Product[]>(items), total, page, pages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getProduct(slug: string) {
  await connectDB();
  const doc = await ProductModel.findOne({ slug, active: true }).lean();
  return doc ? plain<Product>(doc) : null;
}

export async function getProductsBySlugs(slugs: string[]) {
  await connectDB();
  const docs = await ProductModel.find({ slug: { $in: slugs }, active: true }).lean();
  const bySlug = new Map(plain<Product[]>(docs).map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug.get(s)).filter((p): p is Product => !!p);
}

export async function getFeatured(limit = 8) {
  await connectDB();
  const docs = await ProductModel.find({ active: true, featured: true, type: { $ne: 'accessory' } }).sort({ sortOrder: 1 }).limit(limit).lean();
  return plain<Product[]>(docs);
}

export async function getRelated(product: Product, limit = 4) {
  await connectDB();
  const docs = await ProductModel.find({
    active: true,
    slug: { $ne: product.slug },
    type: { $ne: 'accessory' },
    $or: [{ styles: { $in: product.styles } }, { type: product.type }],
  })
    .sort({ sortOrder: 1 })
    .limit(limit)
    .lean();
  return plain<Product[]>(docs);
}

export async function getAccessories(limit = 4) {
  await connectDB();
  return plain<Product[]>(await ProductModel.find({ active: true, type: 'accessory' }).sort({ sortOrder: 1 }).limit(limit).lean());
}

export async function countByType() {
  await connectDB();
  const rows = await ProductModel.aggregate([{ $match: { active: true } }, { $group: { _id: '$type', n: { $sum: 1 } } }]);
  return Object.fromEntries(rows.map((r: { _id: string; n: number }) => [r._id, r.n])) as Record<string, number>;
}

export type Article = {
  _id: string;
  slug: string;
  category: 'route' | 'tips' | 'collection';
  title: { vi: string; en?: string };
  excerpt: { vi: string; en?: string };
  cover: string;
  body: { kind: 'p' | 'h2' | 'img' | 'quote'; vi?: string; en?: string; src?: string }[];
  productSlugs: string[];
  publishedAt: string;
};

export async function getArticles(category?: string, limit = 24) {
  await connectDB();
  const filter: Record<string, unknown> = { published: true };
  if (category && ['route', 'tips', 'collection'].includes(category)) filter.category = category;
  return plain<Article[]>(await ArticleModel.find(filter).sort({ publishedAt: -1 }).limit(limit).lean());
}

export async function getArticle(slug: string) {
  await connectDB();
  const doc = await ArticleModel.findOne({ slug, published: true }).lean();
  return doc ? plain<Article>(doc) : null;
}

export type Review = { _id: string; name: string; rating: number; text: string; createdAt: string };

export async function getReviews(productSlug: string) {
  await connectDB();
  return plain<Review[]>(await ReviewModel.find({ productSlug, approved: true }).sort({ createdAt: -1 }).limit(20).lean());
}

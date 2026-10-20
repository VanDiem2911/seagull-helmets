// Usage: npm run seed            (upsert sample products, coupons and journal articles)
//        npm run seed -- --fresh  (also wipes products/articles/coupons first; orders are never touched)
import mongoose from 'mongoose';
import { ProductModel, CouponModel, ArticleModel } from '../lib/models.ts';
import { products, coupons, articles } from '../lib/seed-data.ts';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/seagull_vn';
await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

if (process.argv.includes('--fresh')) {
  await Promise.all([ProductModel.deleteMany({}), CouponModel.deleteMany({}), ArticleModel.deleteMany({})]);
}

for (const p of products) {
  await ProductModel.updateOne({ slug: p.slug }, { $set: { ...p, active: true } }, { upsert: true });
}
for (const c of coupons) {
  await CouponModel.updateOne({ code: c.code }, { $set: c }, { upsert: true });
}
for (const a of articles) {
  await ArticleModel.updateOne({ slug: a.slug }, { $set: { ...a, publishedAt: new Date(a.publishedAt), published: true } }, { upsert: true });
}

await ProductModel.syncIndexes();
console.log(`Seeded ${products.length} products, ${coupons.length} coupons, ${articles.length} articles → ${uri.replace(/\/\/.*@/, '//***@')}`);
await mongoose.disconnect();

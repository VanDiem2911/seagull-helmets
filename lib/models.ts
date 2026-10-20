// NOTE: this file must only import 'mongoose' (no relative imports) so scripts/seed.ts can load it directly in Node.
import mongoose from 'mongoose';
import type { Model } from 'mongoose';

const { Schema } = mongoose;
type Schema = InstanceType<typeof mongoose.Schema>;

const L10n = { vi: { type: String, required: true }, en: { type: String } };
const L10nOpt = { vi: { type: String }, en: { type: String } };

const colorSchema = new Schema(
  {
    key: { type: String, required: true },
    name: L10n,
    family: { type: String, required: true },
    hex: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    name: L10n,
    summary: L10n,
    features: { vi: [String], en: [String] },
    type: { type: String, required: true, index: true },
    styles: { type: [String], index: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: Number,
    colors: { type: [colorSchema], validate: (v: unknown[]) => v.length > 0 },
    sizes: [String],
    specs: [{ _id: false, label: L10n, value: L10n }],
    story: { type: new Schema({ text: L10n, image: String }, { _id: false }) },
    badges: [String],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);
productSchema.index({ 'name.vi': 'text', 'name.en': 'text', code: 'text', slug: 'text' });

const orderItemSchema = new Schema(
  {
    slug: String,
    code: String,
    name: String,
    color: String,
    colorName: String,
    size: String,
    qty: { type: Number, min: 1 },
    price: Number,
    image: String,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
      email: String,
      address: { type: String, required: true },
      ward: String,
      district: String,
      city: { type: String, required: true },
      note: String,
    },
    subtotal: Number,
    shippingFee: Number,
    discount: { type: Number, default: 0 },
    couponCode: String,
    total: Number,
    paymentMethod: { type: String, enum: ['cod', 'bank'], required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    status: { type: String, enum: ['new', 'confirmed', 'shipping', 'done', 'cancelled'], default: 'new', index: true },
    locale: String,
  },
  { timestamps: true },
);

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    kind: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    minSubtotal: { type: Number, default: 0 },
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true },
    description: L10nOpt,
  },
  { timestamps: true },
);

const subscriberSchema = new Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true }, locale: String },
  { timestamps: true },
);

const articleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ['route', 'tips', 'collection'], required: true, index: true },
    title: L10n,
    excerpt: L10n,
    cover: { type: String, required: true },
    body: [{ _id: false, kind: { type: String, enum: ['p', 'h2', 'img', 'quote'] }, vi: String, en: String, src: String }],
    productSlugs: [String],
    publishedAt: { type: Date, default: Date.now, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    topic: { type: String, enum: ['size', 'order', 'partner'], required: true },
    message: { type: String, required: true },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const reviewSchema = new Schema(
  {
    productSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

export const ProductModel = model<any>('Product', productSchema);
export const OrderModel = model<any>('Order', orderSchema);
export const CouponModel = model<any>('Coupon', couponSchema);
export const SubscriberModel = model<any>('Subscriber', subscriberSchema);
export const ArticleModel = model<any>('Article', articleSchema);
export const ContactModel = model<any>('Contact', contactSchema);
export const ReviewModel = model<any>('Review', reviewSchema);

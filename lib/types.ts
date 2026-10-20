export type Locale = 'vi' | 'en';
export const locales: Locale[] = ['vi', 'en'];
export const defaultLocale: Locale = 'vi';
export const isLocale = (v: string): v is Locale => (locales as string[]).includes(v);

export type L10n = { vi: string; en?: string };
export const pick = (v: L10n | undefined, locale: Locale) => (v ? (locale === 'en' && v.en ? v.en : v.vi) : '');

export const helmetTypes = ['fullface', 'three-quarter', 'half', 'classic', 'accessory'] as const;
export type HelmetType = (typeof helmetTypes)[number];

export const ridingStyles = ['city', 'touring', 'vintage'] as const;
export type RidingStyle = (typeof ridingStyles)[number];

export const colorFamilies = ['black', 'white', 'grey', 'red', 'blue', 'green', 'pink', 'brown', 'yellow', 'purple', 'beige'] as const;
export type ColorFamily = (typeof colorFamilies)[number];

export type ProductColor = { key: string; name: L10n; family: ColorFamily; hex: string; image: string };

export type Product = {
  _id: string;
  slug: string;
  code: string;
  name: L10n;
  summary: L10n;
  features: { vi: string[]; en?: string[] };
  type: HelmetType;
  styles: RidingStyle[];
  price: number;
  comparePrice?: number;
  colors: ProductColor[];
  sizes: string[];
  specs: { label: L10n; value: L10n }[];
  story?: { text: L10n; image: string };
  badges: ('new' | 'bestseller')[];
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
};

export type CartLine = {
  slug: string;
  color: string; // colour key
  size: string; // '' for products without sizes
  qty: number;
};

export const orderStatuses = ['new', 'confirmed', 'shipping', 'done', 'cancelled'] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const paymentMethods = ['cod', 'bank'] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

// Shop-wide constants. Items marked TODO come from the client brief but still need to be confirmed.
export const site = {
  name: 'Seagull Helmets',
  legalName: 'SEAGULL HELMETS',
  customerCode: 'DN0071',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  phone: '0938810557',
  phoneDisplay: '093 881 05 57',
  zaloPhone: process.env.NEXT_PUBLIC_ZALO_PHONE ?? '0938810557',
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL ?? 'https://m.me/seagull.helmets', // TODO: confirm the VN fanpage
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/seagull.helmets', // TODO: confirm the VN fanpage
  instagramUrl: 'https://www.instagram.com/seagullhelmets/',
  email: 'service@seagull-helmets.com', // TODO: confirm the VN mailbox
  address: {
    street: '68 Út Tịch',
    ward: 'Tân Sơn Nhất',
    city: 'TP. Hồ Chí Minh',
    full: '68 Út Tịch, Tân Sơn Nhất, TP. Hồ Chí Minh',
  },
  hours: { vi: '08:30 – 20:30, mọi ngày', en: '08:30 – 20:30, daily' }, // TODO: confirm opening hours
  geo: { lat: 10.7957, lng: 106.6601 }, // approximate; used for structured data only
} as const;

export const zaloUrl = `https://zalo.me/${site.zaloPhone}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`;
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.full)}`;

// Checkout rules (VND). TODO: confirm with the shop.
export const shippingRules = {
  flatFee: 30_000,
  freeOver: 1_500_000,
  etaDays: { vi: '2–4 ngày làm việc', en: '2–4 business days' },
};

export function shippingFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= shippingRules.freeOver ? 0 : shippingRules.flatFee;
}

export const bank = {
  id: process.env.BANK_ID ?? '',
  account: process.env.BANK_ACCOUNT ?? '',
  name: process.env.BANK_ACCOUNT_NAME ?? '',
};

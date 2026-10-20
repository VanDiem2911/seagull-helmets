// Sample catalogue used by `npm run seed`. NOTE: no imports here (loaded directly by Node).
// Model names / colourways come from the Seagull Taiwan site and the shared Drive folder.
// Prices (VND), the generic codes (SG-…), sizes and the "bestseller" flags are PLACEHOLDERS for the shop to confirm in /admin.

const p = (slug: string, key: string) => `/images/products/${slug}/${key}.webp`;
const c = (slug: string, key: string, vi: string, en: string, family: string, hex: string) => ({
  key,
  name: { vi, en },
  family,
  hex,
  image: p(slug, key),
});

const madeIn = { label: { vi: 'Xuất xứ', en: 'Origin' }, value: { vi: 'Đài Loan', en: 'Taiwan' } };
const brand = { label: { vi: 'Thương hiệu', en: 'Brand' }, value: { vi: 'Seagull (Hải Âu)', en: 'Seagull' } };
const spec = (vi: string, en: string, vVi: string, vEn: string) => ({ label: { vi, en }, value: { vi: vVi, en: vEn } });

const craftFeatures = {
  vi: [
    'Viền bọc thủ công tỉ mỉ',
    'Lót thoáng, mát và dễ chịu khi đội lâu',
    'Lót và đệm tai tháo rời để vệ sinh',
    'Khóa tự động dạng bậc, giữ chắc',
    'Sản xuất tại Đài Loan – giảm chấn, chống va đập',
  ],
  en: [
    'Hand-finished edge binding',
    'Breathable lining that stays cool on long rides',
    'Removable lining and ear pads for easy cleaning',
    'Stepped auto-buckle that stays secure',
    'Made in Taiwan – shock-absorbing and impact-resistant',
  ],
};

export const products = [
  {
    slug: 'tw-500tx-fc-mexican-butcher',
    code: 'TW-500TX-FC',
    name: { vi: 'Mexican Butcher – Fullface', en: 'Mexican Butcher – Full-face' },
    summary: {
      vi: 'Mũ fullface phong cách Mexican Soul × American Street Culture, họa tiết chopper vẽ tay.',
      en: 'A full-face with Mexican Soul × American Street Culture artwork and hand-drawn chopper graphics.',
    },
    features: craftFeatures,
    type: 'fullface',
    styles: ['vintage', 'touring'],
    price: 3_350_000,
    colors: [
      c('tw-500tx-fc-mexican-butcher', 'cream', 'Họa tiết kem', 'Cream artwork', 'beige', '#E6DCC4'),
      c('tw-500tx-fc-mexican-butcher', 'graphite', 'Họa tiết than chì', 'Graphite artwork', 'grey', '#55575A'),
      c('tw-500tx-fc-mexican-butcher', 'sand', 'Họa tiết cát', 'Sand artwork', 'beige', '#CDBFA3'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', 'Fullface (cả đầu)', 'Full-face'), spec('Kính', 'Visor', 'Kính trong', 'Clear visor')],
    story: {
      text: {
        vi: 'Lấy cảm hứng từ văn hóa chopper và những xưởng độ xe Mỹ, chiếc mũ mang tinh thần “Wild & Free” – hoang dã mà tự do. Mỗi họa tiết đều có câu chuyện riêng trên từng cung đường.',
        en: 'Inspired by chopper culture and American custom garages, this helmet carries a “Wild & Free” spirit – a story on every road.',
      },
      image: '/images/butcher.webp',
    },
    badges: ['new'],
    featured: false,
    sortOrder: 1,
  },
  {
    slug: 'tw-786-flying-tigers',
    code: 'TW-786',
    name: { vi: 'Flying Tigers – Mũ 3/4 Phi Hổ', en: 'Flying Tigers – 3/4 Helmet' },
    summary: {
      vi: 'Mũ 3/4 cổ điển in huy hiệu Flying Tigers, tôn vinh phi đội huyền thoại – “Ride with legend”.',
      en: 'A classic 3/4 helmet printed with the Flying Tigers emblem – “Ride with legend”.',
    },
    features: craftFeatures,
    type: 'three-quarter',
    styles: ['vintage', 'city'],
    price: 1_450_000,
    colors: [
      c('tw-786-flying-tigers', 'silver', 'Bạc', 'Silver', 'grey', '#B9BCBF'),
      c('tw-786-flying-tigers', 'olive', 'Xanh rêu', 'Olive', 'green', '#5F6A52'),
      c('tw-786-flying-tigers', 'cream', 'Kem', 'Cream', 'beige', '#E9E2CE'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', '3/4 cổ điển', 'Classic 3/4'), spec('Phụ kiện', 'Accessory', 'Tương thích kính bong bóng 3 nút', 'Fits 3-snap bubble visor')],
    story: {
      text: {
        vi: 'Dáng 3/4 gọn nhẹ, bề mặt sơn bạc rạn như kim loại cũ. Tối giản đến mức chỉ cần một chiếc áo da và con đường phía trước.',
        en: 'A light 3/4 shell with a crackled silver finish like aged metal – all you need is a leather jacket and the road ahead.',
      },
      image: '/images/tigers-trio.webp',
    },
    badges: ['new', 'bestseller'],
    featured: false,
    sortOrder: 2,
  },
  {
    slug: 'tw-786-sky-guardians',
    code: 'TW-786',
    name: { vi: 'Sky Guardians – Mũ 3/4', en: 'Sky Guardians – 3/4 Helmet' },
    summary: {
      vi: 'Cùng khung vỏ TW-786, họa tiết Sky Guardians tinh tế trên nền trơn dịu.',
      en: 'The TW-786 shell with refined Sky Guardians artwork on a calm solid finish.',
    },
    features: craftFeatures,
    type: 'three-quarter',
    styles: ['vintage', 'city'],
    price: 1_450_000,
    colors: [
      c('tw-786-sky-guardians', 'cream', 'Kem', 'Cream', 'beige', '#E9E2CE'),
      c('tw-786-sky-guardians', 'silver', 'Bạc', 'Silver', 'grey', '#B9BCBF'),
      c('tw-786-sky-guardians', 'olive', 'Xanh rêu', 'Olive', 'green', '#5F6A52'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', '3/4 cổ điển', 'Classic 3/4')],
    badges: ['new'],
    featured: false,
    sortOrder: 3,
  },
  {
    slug: 'tw-500tx-fc-retro',
    code: 'TW-500TX-FC',
    name: { vi: 'Retro Solid – Fullface', en: 'Retro Solid – Full-face' },
    summary: {
      vi: 'Fullface dáng retro, màu trơn, huy hiệu đồng nhỏ trên trán – dễ phối với mọi bộ đồ.',
      en: 'A retro full-face in solid colours with a small brass badge – easy to match with anything.',
    },
    features: craftFeatures,
    type: 'fullface',
    styles: ['city', 'vintage'],
    price: 3_350_000,
    colors: [
      c('tw-500tx-fc-retro', 'cream', 'Kem', 'Cream', 'beige', '#E9E2CE'),
      c('tw-500tx-fc-retro', 'matte-black', 'Đen nhám', 'Matte black', 'black', '#26231F'),
      c('tw-500tx-fc-retro', 'gloss-black', 'Đen bóng', 'Gloss black', 'black', '#121110'),
      c('tw-500tx-fc-retro', 'silver', 'Bạc', 'Silver', 'grey', '#B9BCBF'),
      c('tw-500tx-fc-retro', 'navy', 'Xanh navy', 'Navy', 'blue', '#1F2E4D'),
      c('tw-500tx-fc-retro', 'black-copper', 'Đen viền đồng', 'Black & copper', 'black', '#2C2824'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', 'Fullface (cả đầu)', 'Full-face'), spec('Số màu', 'Colours', '6', '6')],
    badges: ['bestseller'],
    featured: true,
    sortOrder: 4,
  },
  {
    slug: 'tw-500tx-f-road',
    code: 'TW-500TX-F',
    name: { vi: 'Road Stripe – Fullface', en: 'Road Stripe – Full-face' },
    summary: {
      vi: 'Fullface retro với sọc dọc cổ điển như đường đua thập niên 70.',
      en: 'A retro full-face with classic racing stripes straight out of the 70s.',
    },
    features: craftFeatures,
    type: 'fullface',
    styles: ['touring', 'vintage'],
    price: 3_350_000,
    colors: [
      c('tw-500tx-f-road', 'pink', 'Hồng sọc đen', 'Pink / black stripe', 'pink', '#E8A9B8'),
      c('tw-500tx-f-road', 'italia', 'Đỏ sọc Ý', 'Italia red', 'red', '#C62F2A'),
      c('tw-500tx-f-road', 'black-white', 'Đen sọc trắng', 'Black / white stripe', 'black', '#1E1B19'),
      c('tw-500tx-f-road', 'olive-black', 'Xanh rêu sọc đen', 'Olive / black stripe', 'green', '#5E6650'),
      c('tw-500tx-f-road', 'black-stripe', 'Đen sọc trắng đậm', 'Black / bold white stripe', 'black', '#24211E'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', 'Fullface (cả đầu)', 'Full-face')],
    badges: [],
    featured: true,
    sortOrder: 5,
  },
  {
    slug: 'tw-500tx-f-madmax',
    code: 'TW-500TX-F',
    name: { vi: 'Mad Max – Fullface', en: 'Mad Max – Full-face' },
    summary: {
      vi: 'Nửa đen trầm, nửa kim tuyến rực – dành cho người thích nổi bật trên đường.',
      en: 'Deep black on top, a flash of metal-flake below – made to stand out on the road.',
    },
    features: craftFeatures,
    type: 'fullface',
    styles: ['touring', 'city'],
    price: 3_590_000,
    colors: [
      c('tw-500tx-f-madmax', 'magenta', 'Hồng tím kim tuyến', 'Magenta flake', 'pink', '#B03A8A'),
      c('tw-500tx-f-madmax', 'red', 'Đen đỏ', 'Black / red', 'red', '#8E1F25'),
      c('tw-500tx-f-madmax', 'gold', 'Đen vàng đồng', 'Black / gold', 'yellow', '#C99A2E'),
      c('tw-500tx-f-madmax', 'silver', 'Đen bạc', 'Black / silver', 'grey', '#A9ADB0'),
      c('tw-500tx-f-madmax', 'green', 'Đen xanh lá', 'Black / green flake', 'green', '#1F7A3E'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', 'Fullface (cả đầu)', 'Full-face')],
    badges: ['new'],
    featured: true,
    sortOrder: 6,
  },
  {
    slug: 'tw-863-downhill',
    code: 'TW-863',
    name: { vi: 'Downhill – Mũ fullface', en: 'Downhill – Full-face' },
    summary: {
      vi: 'Dáng “mũ núi” hàm thoáng khí, hợp đường đèo, đường đất và những chuyến đi dài.',
      en: 'A vented-chin “mountain” shape built for passes, dirt roads and long hauls.',
    },
    features: craftFeatures,
    type: 'fullface',
    styles: ['touring'],
    price: 2_890_000,
    colors: [
      c('tw-863-downhill', 'grey-stripe', 'Xám nhám', 'Matte grey', 'grey', '#6A6866'),
      c('tw-863-downhill', 'black-white', 'Đen sọc trắng', 'Black / white stripe', 'black', '#1E1B19'),
      c('tw-863-downhill', 'white-black', 'Trắng sọc đen', 'White / black stripe', 'white', '#EFEDE8'),
      c('tw-863-downhill', 'grey-black', 'Xám đen', 'Grey / black', 'grey', '#8C8C8C'),
      c('tw-863-downhill', 'matte-black', 'Đen nhám', 'Matte black', 'black', '#26231F'),
      c('tw-863-downhill', 'silver-black', 'Bạc đen', 'Silver / black', 'grey', '#BFC1C3'),
      c('tw-863-downhill', 'pink', 'Hồng trắng', 'Pink / white', 'pink', '#E7A4B6'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', 'Fullface kiểu mũ núi', 'Mountain-style full-face'), spec('Số màu', 'Colours', '7', '7')],
    badges: ['new'],
    featured: true,
    sortOrder: 7,
  },
  {
    slug: 'classic-retro-34',
    code: 'SG-CL01',
    name: { vi: 'Classic Retro – Mũ 3/4 viền đồng', en: 'Classic Retro – 3/4 with copper trim' },
    summary: {
      vi: 'Mũ 3/4 trơn kiểu cổ điển với viền da và đường chỉ đồng – hợp xe scooter và café racer.',
      en: 'A plain classic 3/4 with leather-look trim and copper pinstripe – made for scooters and café racers.',
    },
    features: craftFeatures,
    type: 'classic',
    styles: ['vintage', 'city'],
    price: 1_990_000,
    colors: [
      c('classic-retro-34', 'red', 'Đỏ metallic', 'Metallic red', 'red', '#A8261F'),
      c('classic-retro-34', 'green', 'Xanh rêu viền đồng', 'Moss green / copper', 'green', '#4F6B57'),
      c('classic-retro-34', 'brown', 'Nâu nhám', 'Matte brown', 'brown', '#5A3A2C'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', '3/4 cổ điển', 'Classic 3/4')],
    badges: [],
    featured: true,
    sortOrder: 8,
  },
  {
    slug: 'classic-34-bubble',
    code: 'SG-CL02',
    name: { vi: 'Classic Bubble – Mũ 3/4 kèm kính bong bóng', en: 'Classic Bubble – 3/4 with bubble visor' },
    summary: {
      vi: 'Mũ 3/4 màu kem, viền nâu, kèm kính bong bóng – bộ đôi hoàn hảo cho phong cách vintage.',
      en: 'A cream 3/4 with brown trim and a bubble visor – the perfect vintage pair.',
    },
    features: craftFeatures,
    type: 'classic',
    styles: ['vintage', 'city'],
    price: 1_690_000,
    colors: [c('classic-34-bubble', 'cream', 'Kem', 'Cream', 'beige', '#E9E2CE')],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, madeIn, spec('Kiểu mũ', 'Helmet type', '3/4 cổ điển + kính', '3/4 with visor')],
    badges: [],
    featured: false,
    sortOrder: 9,
  },
  {
    slug: 'half-pilot',
    code: 'SG-HF01',
    name: { vi: 'Pilot – Mũ nửa đầu kính phi công', en: 'Pilot – Half helmet with visor' },
    summary: {
      vi: 'Nửa đầu gọn nhẹ, kính che nắng gió, nhiều màu trơn – chiếc mũ “đi phố” dễ đội nhất.',
      en: 'A light half helmet with a wind visor in many solid colours – the easiest city-ride helmet.',
    },
    features: {
      vi: ['Kính che gió bụi, có khe thoáng', 'Vỏ gọn nhẹ, đội cả ngày không mỏi cổ', 'Lót tháo rời để vệ sinh', 'Khóa cài nhanh'],
      en: ['Wind visor with vents', 'Light shell, comfortable all day', 'Removable lining for easy cleaning', 'Quick-release buckle'],
    },
    type: 'half',
    styles: ['city'],
    price: 1_290_000,
    colors: [
      c('half-pilot', 'navy', 'Xanh navy', 'Navy', 'blue', '#1E2F4F'),
      c('half-pilot', 'white', 'Trắng', 'White', 'white', '#F1EFEA'),
      c('half-pilot', 'purple', 'Tím', 'Purple', 'purple', '#7B5CA8'),
      c('half-pilot', 'grey', 'Xám', 'Grey', 'grey', '#8E9196'),
      c('half-pilot', 'italia', 'Cờ Ý', 'Italia', 'red', '#C9382D'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, spec('Kiểu mũ', 'Helmet type', 'Nửa đầu có kính', 'Half helmet with visor')],
    badges: ['bestseller'],
    featured: true,
    sortOrder: 10,
  },
  {
    slug: 'half-vintage-visor',
    code: 'SG-HF02',
    name: { vi: 'Vintage Visor – Nửa đầu kính vintage', en: 'Vintage Visor – Retro half helmet' },
    summary: {
      vi: 'Nửa đầu dáng tròn, kính ngắn kiểu cổ điển, có bản kim tuyến vàng bắt sáng.',
      en: 'A rounded half helmet with a short retro visor, including a glittering gold flake edition.',
    },
    features: {
      vi: ['Kính ngắn kiểu cổ điển', 'Dây cài chắc chắn', 'Lót mềm tháo rời'],
      en: ['Short retro visor', 'Secure chin strap', 'Soft removable lining'],
    },
    type: 'half',
    styles: ['city', 'vintage'],
    price: 1_490_000,
    colors: [
      c('half-vintage-visor', 'gold', 'Vàng kim tuyến', 'Gold flake', 'yellow', '#C4A24B'),
      c('half-vintage-visor', 'beige', 'Be', 'Beige', 'beige', '#CDB89B'),
      c('half-vintage-visor', 'cream-stripe', 'Kem sọc đen', 'Cream / black stripe', 'beige', '#E6DFCB'),
    ],
    sizes: ['M', 'L', 'XL'],
    specs: [brand, spec('Kiểu mũ', 'Helmet type', 'Nửa đầu có kính', 'Half helmet with visor')],
    badges: [],
    featured: true,
    sortOrder: 11,
  },
  {
    slug: 'kids-cat',
    code: 'SG-KD01',
    name: { vi: 'Kids Cat – Mũ nửa đầu trẻ em họa tiết mèo', en: 'Kids Cat – Children’s half helmet' },
    summary: {
      vi: 'Họa tiết chú mèo ôm nấm ngộ nghĩnh, vỏ nhẹ cho bé và cho cả người thích sự dễ thương.',
      en: 'A cheeky cat-hugging-a-mushroom print on a light shell, for kids and the young at heart.',
    },
    features: {
      vi: ['Vỏ nhẹ', 'Kính che gió', 'Lót mềm, tháo rời', 'Khóa cài nhanh'],
      en: ['Light shell', 'Wind visor', 'Soft removable lining', 'Quick-release buckle'],
    },
    type: 'half',
    styles: ['city'],
    price: 990_000,
    colors: [
      c('kids-cat', 'sand', 'Be – Mèo', 'Sand – Cat', 'beige', '#CDB39B'),
      c('kids-cat', 'sky', 'Xanh – Mèo', 'Sky – Cat', 'blue', '#86C4E8'),
    ],
    sizes: ['S', 'M'],
    specs: [brand, spec('Kiểu mũ', 'Helmet type', 'Nửa đầu có kính', 'Half helmet with visor')],
    badges: [],
    featured: true,
    sortOrder: 12,
  },
  {
    slug: 'bubble-visor',
    code: 'SG-AC01',
    name: { vi: 'Kính bong bóng 3 nút (màu khói)', en: '3-snap bubble visor (smoke)' },
    summary: {
      vi: 'Kính bong bóng màu khói lắp được cho mũ 3/4 dòng TW-786 và các mũ có 3 nút bấm.',
      en: 'A smoke bubble visor that fits the TW-786 3/4 helmets and other 3-snap helmets.',
    },
    features: {
      vi: ['Kính bong bóng bấm 3 nút', 'Màu khói giảm chói', 'Dễ tháo lắp'],
      en: ['3-snap bubble visor', 'Smoke tint reduces glare', 'Easy to fit and remove'],
    },
    type: 'accessory',
    styles: ['city', 'vintage'],
    price: 320_000,
    colors: [c('bubble-visor', 'smoke', 'Khói', 'Smoke', 'grey', '#8A8782')],
    sizes: [],
    specs: [brand, madeIn],
    badges: [],
    featured: false,
    sortOrder: 13,
  },
];

export const coupons = [
  {
    code: 'WELCOME10',
    kind: 'percent',
    value: 10,
    minSubtotal: 0,
    active: true,
    description: { vi: 'Giảm 10% cho đơn đầu tiên', en: '10% off your first order' },
  },
  {
    code: 'SEAGULL100K',
    kind: 'fixed',
    value: 100_000,
    minSubtotal: 2_000_000,
    active: true,
    description: { vi: 'Giảm 100.000₫ cho đơn từ 2.000.000₫', en: '100,000₫ off orders over 2,000,000₫' },
  },
];

type Block = { kind: 'p' | 'h2' | 'img' | 'quote'; vi?: string; en?: string; src?: string };
const P = (vi: string, en?: string): Block => ({ kind: 'p', vi, en });
const H = (vi: string, en?: string): Block => ({ kind: 'h2', vi, en });
const Q = (vi: string, en?: string): Block => ({ kind: 'quote', vi, en });
const IMG = (src: string): Block => ({ kind: 'img', src });

export const articles = [
  {
    slug: 'ha-giang-3-ngay-mot-chiec-mu',
    category: 'route',
    title: { vi: 'Hà Giang 3 ngày: một chiếc mũ, bốn mùa trong một chuyến đi', en: 'Hà Giang in 3 days: one helmet, four seasons in one trip' },
    excerpt: {
      vi: 'Cung đường vòng Hà Giang qua Quản Bạ, Yên Minh, Đồng Văn, Mã Pí Lèng – và vì sao chọn mũ đúng quan trọng hơn bạn nghĩ.',
      en: 'The Hà Giang loop through Quản Bạ, Yên Minh, Đồng Văn and Mã Pí Lèng – and why the right helmet matters.',
    },
    cover: '/images/photo/cafe-1.webp',
    productSlugs: ['tw-786-flying-tigers', 'bubble-visor', 'tw-863-downhill'],
    publishedAt: '2026-10-12',
    body: [
      P('Hà Giang thay đổi thời tiết theo từng khúc cua: sáng sương lạnh ở cổng trời, trưa nắng gắt ở thung lũng, chiều gió lùa qua đèo. Một chiếc mũ phải làm được nhiều việc cùng lúc.'),
      IMG('/images/photo/river-3.webp'),
      H('Ngày 1 – Hà Giang đến Yên Minh'),
      P('Đoạn đầu khá dễ đi, nhưng càng lên cao gió càng mạnh. Mũ 3/4 kèm kính bong bóng giúp chắn gió bụi mà vẫn thoáng đầu khi trời còn ấm.'),
      H('Ngày 2 – Đồng Văn và Mã Pí Lèng'),
      P('Đây là ngày dài nhất. Sương mù dày, đường trơn, nhiều khúc cua gấp – người đi nhiều thường chuyển sang mũ fullface cho cảm giác yên tâm hơn, nhất là khi xuống đèo.'),
      Q('Đội chất, đi xa – nhưng trước hết là đi an toàn.', 'Ride far, ride in style – but ride safe first.'),
      H('Ngày 3 – Về lại thành phố'),
      P('Mũ sau ba ngày bụi đường cần được vệ sinh: tháo lót, giặt tay nhẹ, phơi nơi thoáng mát. Xem thêm mẹo bảo quản trong mục Mẹo phượt.'),
    ],
  },
  {
    slug: 'ta-xua-san-may-chon-mu-nao',
    category: 'route',
    title: { vi: 'Tà Xùa săn mây: lạnh, gió và chiếc mũ fullface', en: 'Tà Xùa cloud-hunting: cold, wind and a full-face helmet' },
    excerpt: {
      vi: 'Dậy từ 3 giờ sáng để kịp biển mây – những điều nên chuẩn bị cho cung đường đèo dốc.',
      en: 'Up at 3 a.m. for the sea of clouds – what to prepare for steep mountain passes.',
    },
    cover: '/images/photo/river-1.webp',
    productSlugs: ['tw-863-downhill', 'tw-500tx-f-road'],
    publishedAt: '2026-10-05',
    body: [
      P('Săn mây là kiểu chuyến đi bắt đầu khi trời còn tối. Nhiệt độ thấp, gió mạnh và đường dốc khiến mũ fullface trở thành lựa chọn hợp lý.'),
      IMG('/images/photo/cafe-3.webp'),
      P('Dòng TW-863 dáng mũ núi có hàm thoáng khí, phù hợp khi leo dốc và những đoạn đường đất. Nếu thích phong cách retro, dòng Road Stripe với sọc dọc cổ điển cũng là lựa chọn đáng cân nhắc.'),
      P('Nhớ đội mũ vừa khít: mũ lỏng sẽ xoay khi gió mạnh, mũ chật sẽ khiến bạn đau đầu sau vài giờ. Xem bài hướng dẫn chọn size để đo vòng đầu đúng cách.'),
    ],
  },
  {
    slug: 'cach-chon-size-mu-bao-hiem',
    category: 'tips',
    title: { vi: 'Cách chọn size mũ bảo hiểm trong 2 phút', en: 'How to find your helmet size in 2 minutes' },
    excerpt: {
      vi: 'Đo vòng đầu bằng thước dây, đối chiếu bảng size và thử mũ đúng cách.',
      en: 'Measure your head with a tape, match it to the size chart and test the fit.',
    },
    cover: '/images/photo/store-4.webp',
    productSlugs: ['tw-500tx-fc-retro', 'classic-retro-34'],
    publishedAt: '2026-09-28',
    body: [
      H('Bước 1 – Đo vòng đầu'),
      P('Dùng thước dây mềm quấn quanh đầu, vị trí cách lông mày khoảng 1–2 cm và đi qua phần nhô nhất phía sau đầu. Đo hai lần và lấy số lớn hơn.'),
      H('Bước 2 – Đối chiếu bảng size'),
      P('S: 54–55 cm · M: 56–57 cm · L: 58–59 cm · XL: 60–61 cm · XXL: 62–63 cm. Nếu số đo nằm giữa hai size, nên thử cả hai.'),
      H('Bước 3 – Thử mũ'),
      P('Mũ vừa là khi ôm đều hai bên má, không có điểm nào đau nhói, và khi lắc đầu mũ không xoay lệch. Không chắc? Nhắn Zalo cửa hàng để được tư vấn, đổi size trong 7 ngày.'),
    ],
  },
  {
    slug: 'bao-quan-mu-bao-hiem',
    category: 'tips',
    title: { vi: 'Bảo quản mũ bảo hiểm: giặt lót, giữ kính, tránh nắng', en: 'Helmet care: wash the lining, protect the visor, avoid the sun' },
    excerpt: {
      vi: 'Vài thói quen nhỏ giúp mũ bền màu và luôn sạch sau những chuyến đi dài.',
      en: 'A few small habits that keep your helmet fresh and the paint bright.',
    },
    cover: '/images/photo/river-2.webp',
    productSlugs: ['bubble-visor', 'tw-786-sky-guardians'],
    publishedAt: '2026-09-20',
    body: [
      P('Lót và đệm tai của dòng mũ Seagull có thể tháo rời – hãy giặt tay bằng nước lạnh với xà phòng dịu nhẹ, vắt nhẹ và phơi nơi thoáng, không phơi trực tiếp dưới nắng gắt.'),
      P('Kính nên lau bằng khăn mềm, không dùng cồn hay chất tẩy mạnh. Vỏ mũ chỉ cần khăn ẩm; tránh xịt hóa chất lên lớp sơn.'),
      P('Không để mũ trong cốp xe dưới trời nắng, không treo mũ ở gương xe lâu ngày vì có thể làm biến dạng lớp đệm bên trong.'),
    ],
  },
  {
    slug: 'flying-tigers-ride-with-legend',
    category: 'collection',
    title: { vi: 'Flying Tigers – “Ride with legend”', en: 'Flying Tigers – “Ride with legend”' },
    excerpt: {
      vi: 'Bộ sưu tập mũ 3/4 TW-786 lấy cảm hứng từ phi đội Flying Tigers, ba màu bạc – xanh rêu – kem.',
      en: 'The TW-786 3/4 collection inspired by the Flying Tigers: silver, olive and cream.',
    },
    cover: '/images/tigers-trio.webp',
    productSlugs: ['tw-786-flying-tigers', 'tw-786-sky-guardians', 'bubble-visor'],
    publishedAt: '2026-09-10',
    body: [
      P('Huy hiệu hổ có cánh trên nền sao xanh – biểu tượng của một thời kỳ phiêu lưu – được in thủ công lên vỏ mũ 3/4 TW-786.'),
      IMG('/images/lookbook/tigers-silver.webp'),
      P('Ba màu bạc rạn, xanh rêu và kem đều có dáng gọn, hợp với áo da, áo khoác kaki và những chiếc scooter cổ điển. Thêm kính bong bóng khói để hoàn thiện phong cách.'),
    ],
  },
  {
    slug: 'mexican-butcher-wild-and-free',
    category: 'collection',
    title: { vi: 'Mexican Butcher – Wild & Free', en: 'Mexican Butcher – Wild & Free' },
    excerpt: {
      vi: 'TW-500TX-FC với họa tiết chopper: sự gặp gỡ giữa Mexican Soul và American Street Culture.',
      en: 'The TW-500TX-FC with chopper artwork: Mexican Soul meets American Street Culture.',
    },
    cover: '/images/butcher.webp',
    productSlugs: ['tw-500tx-fc-mexican-butcher'],
    publishedAt: '2026-09-01',
    body: [
      P('Những dòng chữ cuộn, hình xương sọ có cánh và câu “Boosts Day” – từng chi tiết được vẽ như một tấm áp phích đua xe thủ công.'),
      P('Phù hợp với những ai thích chiếc mũ biết kể chuyện: vừa là phụ kiện bảo vệ, vừa là một tác phẩm nhỏ đội trên đầu.'),
    ],
  },
] satisfies Array<{
  slug: string;
  category: string;
  title: { vi: string; en?: string };
  excerpt: { vi: string; en?: string };
  cover: string;
  productSlugs: string[];
  publishedAt: string;
  body: Block[];
}>;

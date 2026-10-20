// Converts the source photos in assets-src/ into optimised WebP files in public/images/.
// Run with: npm run images
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const src = (p) => path.join(root, 'assets-src', p);
const out = (p) => {
  const f = path.join(root, 'public', 'images', p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
};
const webp = { quality: 82, effort: 5 };

// ---- product colourways: slug -> [colour key, source] ---------------------------------
const PRODUCTS = {
  'tw-500tx-fc-retro': [
    ['cream', 'web/i62.jpeg'], ['matte-black', 'web/i63.jpeg'], ['gloss-black', 'web/i64.jpeg'],
    ['silver', 'web/i65.jpeg'], ['navy', 'web/i66.jpeg'], ['black-copper', 'web/i67.jpeg'],
  ],
  'tw-500tx-f-road': [
    ['pink', 'web/i68.jpeg'], ['italia', 'web/i69.jpeg'], ['black-white', 'web/i70.jpeg'],
    ['olive-black', 'web/i71.jpeg'], ['black-stripe', 'web/i72.jpeg'],
  ],
  'tw-500tx-f-madmax': [
    ['magenta', 'web/i73.jpeg'], ['red', 'web/i74.jpeg'], ['gold', 'web/i75.jpeg'],
    ['silver', 'web/i76.jpeg'], ['green', 'web/i77.jpeg'],
  ],
  'tw-863-downhill': [
    ['grey-stripe', 'web/i78.jpeg'], ['black-white', 'web/i79.jpeg'], ['white-black', 'web/i80.jpeg'],
    ['grey-black', 'web/i81.jpeg'], ['matte-black', 'web/i82.jpeg'], ['silver-black', 'web/i83.jpeg'],
    ['pink', 'web/i84.jpeg'],
  ],
  'tw-500tx-fc-mexican-butcher': [['cream', 'web/i55.jpeg'], ['graphite', 'web/i57.jpeg'], ['sand', 'web/i59.jpeg']],
  'tw-786-flying-tigers': [['silver', 'web/i25.jpeg'], ['olive', 'web/i27.jpeg'], ['cream', 'web/i35.jpeg']],
  'tw-786-sky-guardians': [['cream', 'web/i29.jpeg'], ['silver', 'web/i31.jpeg'], ['olive', 'web/i33.jpeg']],
  'classic-retro-34': [['green', 'drive/d06.jpg'], ['brown', 'drive/d07.jpg'], ['red', 'drive/d12.jpg']],
  'half-pilot': [
    ['white', 'drive/d03.jpg'], ['purple', 'drive/d19.jpg'], ['grey', 'drive/d20.jpg'],
    ['navy', 'drive/d21.jpg'], ['italia', 'drive/d01.jpg'],
  ],
  'half-vintage-visor': [['beige', 'drive/d02.jpg'], ['gold', 'drive/d13.jpg'], ['cream-stripe', 'drive/d16.jpg']],
  'kids-cat': [['sand', 'drive/d15.jpg'], ['sky', 'drive/d17.jpg']],
  'classic-34-bubble': [['cream', 'drive/d36.jpg']],
  'bubble-visor': [['smoke', 'web/i45.jpeg']],
};

for (const [slug, colours] of Object.entries(PRODUCTS)) {
  for (const [key, file] of colours) {
    await sharp(src(file)).resize({ width: 900, withoutEnlargement: true }).webp(webp).toFile(out(`products/${slug}/${key}.webp`));
  }
}

// ---- editorial / lifestyle crops (avoid the Chinese lettering baked into the originals) --
const crop = async (file, box, name, width = 1200) =>
  sharp(src(file)).extract(box).resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(out(name));

// hero: Flying Tigers trio. The original has Chinese lettering on the empty wall at the left. Cover it with a strip
// of clean wall copied from just above it (edges feathered), so our own copy can sit there. Helmets are untouched.
{
  const W = 1920, H = 1000;
  const dest = { left: 8, top: 436, width: 430, height: 118 };
  const fromTop = 328; // clean wall directly above the lettering
  const feather = 22;
  const strip = await sharp(src('drive/d26.jpg')).extract({ left: dest.left, top: fromTop, width: dest.width, height: dest.height }).blur(1.2).removeAlpha().raw().toBuffer();
  const rgba = Buffer.alloc(dest.width * dest.height * 4);
  for (let y = 0; y < dest.height; y++) {
    for (let x = 0; x < dest.width; x++) {
      const i = y * dest.width + x;
      const d = Math.min(x, y, dest.width - 1 - x, dest.height - 1 - y);
      rgba[i * 4] = strip[i * 3]; rgba[i * 4 + 1] = strip[i * 3 + 1]; rgba[i * 4 + 2] = strip[i * 3 + 2];
      rgba[i * 4 + 3] = Math.round(255 * Math.min(1, d / feather));
    }
  }
  const patch = await sharp(rgba, { raw: { width: dest.width, height: dest.height, channels: 4 } }).png().toBuffer();
  await sharp(src('drive/d26.jpg')).resize(W, H).composite([{ input: patch, left: dest.left, top: dest.top }]).webp({ quality: 88, effort: 5 }).toFile(out('hero-v2.webp'));
}
await crop('drive/d37.jpg', { left: 0, top: 0, width: 880, height: 700 }, 'rider.webp', 1000);
await crop('drive/d29.jpg', { left: 900, top: 0, width: 1020, height: 1000 }, 'butcher.webp', 1000);
await crop('drive/d34.jpg', { left: 980, top: 0, width: 941, height: 700 }, 'mat-black.webp', 1000);
await crop('drive/d26.jpg', { left: 420, top: 280, width: 1500, height: 720 }, 'tigers-trio.webp', 1400);
await crop('drive/d26.jpg', { left: 430, top: 300, width: 520, height: 650 }, 'lookbook/tigers-silver.webp', 700);
await crop('drive/d26.jpg', { left: 870, top: 330, width: 520, height: 650 }, 'lookbook/tigers-olive.webp', 700);
await crop('drive/d26.jpg', { left: 1330, top: 300, width: 520, height: 650 }, 'lookbook/tigers-cream.webp', 700);
await crop('drive/d24.jpg', { left: 478, top: 0, width: 483, height: 750 }, 'lookbook/butcher.webp', 700);
await crop('drive/d34.jpg', { left: 1100, top: 0, width: 560, height: 700 }, 'lookbook/mat-black.webp', 700);
await crop('drive/d37.jpg', { left: 60, top: 0, width: 560, height: 700 }, 'lookbook/rider.webp', 700);
await crop('drive/d26.jpg', { left: 1000, top: 380, width: 640, height: 560 }, 'lookbook/tigers-detail.webp', 700);

// ---- real photos from the shop's Facebook (assets-src/facebook/<set>/…) ------------------
// One folder per photo set. Output: public/images/photo/<prefix>-<n>.webp (n = alphabetical order inside the set)
const PHOTO_SETS = {
  '01-nguoi-mau-trong-tiem': 'store', // model in the shop, helmet wall behind
  '02-nguoi-mau-ngoai-duong': 'street', // woman on the road, white full-face
  '03-vespa-truoc-tiem': 'vespa', // Vespa in front of the shop
  '04-cafe-racer-ngoai-troi': 'cafe', // riders with café racers on grass
  '05-fullface-ven-song': 'river', // male rider by the river
  '06-anh-toi': 'dark', // low-key product shot
};
for (const [folder, prefix] of Object.entries(PHOTO_SETS)) {
  const dir = path.join(root, 'assets-src', 'facebook', folder);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => /.(jpe?g|png|webp)$/i.test(f)).sort();
  for (let i = 0; i < files.length; i++) {
    await sharp(path.join(dir, files[i])).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toFile(out(`photo/${prefix}-${i + 1}.webp`));
  }
}

// ---- brand --------------------------------------------------------------------------
// logo-main.jpg is the logo on white. Turn the white into transparency (un-blend against white so the
// edges stay clean), trim the empty margin, then make a cream version for dark backgrounds (footer).
{
  const raw = await sharp(src('web/logo-main.jpg')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = raw;
  const dark = Buffer.from(data);
  const light = Buffer.from(data);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (a < 0.02) { dark[i + 3] = 0; light[i + 3] = 0; continue; }
    const un = (c) => Math.max(0, Math.min(255, Math.round((c - (1 - a) * 255) / a)));
    const [R, G, B] = [un(r), un(g), un(b)];
    dark[i] = R; dark[i + 1] = G; dark[i + 2] = B; dark[i + 3] = Math.round(a * 255);
    // brown lettering/wing -> cream; the orange bird stays orange
    const brown = R - B < 90;
    light[i] = brown ? 0xf3 : R; light[i + 1] = brown ? 0xec : G; light[i + 2] = brown ? 0xe0 : B; light[i + 3] = Math.round(a * 255);
  }
  const png = async (buf, file) => {
    const trimmed = await sharp(buf, { raw: info }).png().toBuffer().then((p) => sharp(p).trim({ threshold: 1 }).toBuffer());
    await sharp(trimmed).extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } }).resize({ width: 900, withoutEnlargement: true }).png().toFile(out(file));
  };
  await png(dark, 'brand/logo-dark.png');
  await png(light, 'brand/logo-light.png');
  await sharp(src('web/i10.png')).resize({ width: 1200, height: 630, fit: 'contain', background: '#443e35' }).jpeg({ quality: 85 }).toFile(out('og.jpg'));
  fs.mkdirSync(path.join(root, 'app'), { recursive: true });
  await sharp(src('web/i01.png')).resize(96, 96).png().toFile(path.join(root, 'app', 'icon.png'));
}
console.log('images ready');

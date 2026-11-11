// Resize and recompress images in public/images in place so phones never
// download camera-sized files. Run with `npm run images` after adding photos.
//
// Rules: photos are capped at MAX_WIDTH px wide (sharp enough for any screen)
// and re-encoded as progressive JPEG at QUALITY. PNGs are resized the same way
// and palette-compressed. Files already within limits are left alone.
// Per-file overrides (e.g. the logo) live in OVERRIDES. Set BACKUP_DIR to keep
// copies of anything that gets rewritten.

import { readdir, stat, mkdir, copyFile, rename } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = new URL('../public/images/', import.meta.url).pathname;
const MAX_WIDTH = 2000;
const QUALITY = 80;
const BACKUP_DIR = process.env.BACKUP_DIR || '';
const OVERRIDES = {
  // Displayed at 64px in the header and footer; 256px covers Retina.
  'serc-logo.png': { maxWidth: 256 },
};

const exts = new Set(['.jpg', '.jpeg', '.png']);
const files = (await readdir(DIR)).filter((f) => exts.has(path.extname(f).toLowerCase()));
if (BACKUP_DIR) await mkdir(BACKUP_DIR, { recursive: true });

let before = 0, after = 0, changed = 0;
for (const name of files) {
  const file = path.join(DIR, name);
  const size = (await stat(file)).size;
  const meta = await sharp(file).metadata();
  const maxWidth = OVERRIDES[name]?.maxWidth ?? MAX_WIDTH;
  const tooWide = (meta.width ?? 0) > maxWidth;
  const tooBig = size > 400 * 1024;
  before += size;
  if (!tooWide && !tooBig) { after += size; continue; }

  const isPng = path.extname(name).toLowerCase() === '.png';
  let pipeline = sharp(file).rotate(); // bake in EXIF orientation
  if (tooWide) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  pipeline = isPng
    ? pipeline.png({ compressionLevel: 9, palette: true, quality: 90 })
    : pipeline.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });

  const tmp = file + '.tmp';
  await pipeline.toFile(tmp);
  const newSize = (await stat(tmp)).size;
  if (newSize >= size) { // never make a file bigger
    await rename(tmp, tmp.replace(/\.tmp$/, '.discard')).catch(() => {});
    await import('node:fs/promises').then((fs) => fs.rm(tmp.replace(/\.tmp$/, '.discard'), { force: true }));
    after += size; continue;
  }
  if (BACKUP_DIR) await copyFile(file, path.join(BACKUP_DIR, name));
  await rename(tmp, file);
  after += newSize; changed += 1;
  const outMeta = await sharp(file).metadata();
  console.log(`${name.padEnd(34)} ${meta.width}x${meta.height} ${(size / 1024).toFixed(0).padStart(6)} KB -> ${outMeta.width}x${outMeta.height} ${(newSize / 1024).toFixed(0).padStart(5)} KB`);
}
console.log(`\n${changed} file(s) rewritten. Total ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);

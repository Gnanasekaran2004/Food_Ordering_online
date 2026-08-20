/**
 * SAVORIA — Image → WebP Conversion Script
 * ─────────────────────────────────────────
 * Converts all project JPEG images to WebP at quality 82.
 * Originals are kept. WebP files are written alongside them.
 * 
 * Run: node scripts/convert-images.cjs
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const QUALITY = 82;

const IMAGE_DIRS = [
  path.resolve(__dirname, '../src/pages/Order/images'),
  path.resolve(__dirname, '../src/pages/Services/images'),
  path.resolve(__dirname, '../src/data/images'),
];

async function convertDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`  [skip] ${dir} — not found`);
    return;
  }

  const files = fs.readdirSync(dir).filter(f =>
    /\.(jpe?g|png)$/i.test(f) && !f.endsWith('.webp')
  );

  for (const file of files) {
    const src  = path.join(dir, file);
    const dest = path.join(dir, path.parse(file).name + '.webp');

    if (fs.existsSync(dest)) {
      const srcSize  = fs.statSync(src).size;
      const destSize = fs.statSync(dest).size;
      console.log(`  [skip] ${file} → already exists (${kb(destSize)} KB vs ${kb(srcSize)} KB orig)`);
      continue;
    }

    try {
      const info = await sharp(src).webp({ quality: QUALITY }).toFile(dest);
      const origSize = fs.statSync(src).size;
      const saving   = ((1 - info.size / origSize) * 100).toFixed(1);
      console.log(`  [done] ${file} → ${path.parse(file).name}.webp  ${kb(origSize)} KB → ${kb(info.size)} KB  (${saving}% smaller)`);
    } catch (err) {
      console.error(`  [fail] ${file}: ${err.message}`);
    }
  }
}

function kb(bytes) { return Math.round(bytes / 1024); }

(async () => {
  let totalOrig = 0, totalWebp = 0;

  for (const dir of IMAGE_DIRS) {
    console.log(`\n📂  ${path.relative(path.resolve(__dirname, '..'), dir)}`);
    await convertDir(dir);
  }

  // Final summary
  console.log('\n✅  Conversion complete.\n');
})();

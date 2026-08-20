// Updates all image imports in data files from .jpg to .webp
const fs   = require('fs');
const path = require('path');

const files = [
  path.resolve(__dirname, '../src/data/menuData.js'),
  path.resolve(__dirname, '../src/data/servicesData.js'),
  path.resolve(__dirname, '../src/data/restaurantData.js'),
  path.resolve(__dirname, '../src/data/aboutData.js'),
  path.resolve(__dirname, '../src/data/contactData.js'),
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  // Only replace .jpg in import statements (lines starting with import)
  const after = before.replace(/(import\s+\S+\s+from\s+['"][^'"]+)\.jpg(['"])/g, '$1.webp$2');
  if (before !== after) {
    fs.writeFileSync(file, after, 'utf8');
    const count = (after.match(/\.webp/g) || []).length;
    console.log(`Updated ${path.basename(file)}: ${count} webp imports`);
  } else {
    console.log(`No jpg imports found in ${path.basename(file)}`);
  }
}
console.log('Done.');

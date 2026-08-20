const fs = require('fs');
const file = 'f:/repos/Food_Ordering_online/savoria/src/data/menuData.js';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/\.\.\/\.\.\/pages\/Order\/images\//g, '../pages/Order/images/');
fs.writeFileSync(file, data);
console.log('Fixed paths!');

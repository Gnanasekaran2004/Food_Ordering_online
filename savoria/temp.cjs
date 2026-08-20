const fs = require('fs');
const file = 'f:/repos/Food_Ordering_online/savoria/src/data/menuData.js';
let data = fs.readFileSync(file, 'utf8');

const imports = `import imgArtisanStillWater from '../../pages/Order/images/Artisan-Still-Water.jpg';
import imgBraisedA5WagyuShortRib from '../../pages/Order/images/Braised-A5-Wagyu-Short-Rib.jpg';
import imgButterPoachedLobster from '../../pages/Order/images/Butter-Poached Lobster.jpg';
import imgCauliflowerSteak from '../../pages/Order/images/Cauliflower-Steak.jpg';
import imgChefsTableExperience from '../../pages/Order/images/Chef\\'s-Table-Experience.jpg';
import imgChileanSeaBass from '../../pages/Order/images/Chilean-Sea-Bass.jpg';
import imgDuckConfit from '../../pages/Order/images/Duck-Confit.jpg';
import imgGrilledTigerPrawns from '../../pages/Order/images/Grilled-Tiger-Prawns.jpg';
import imgHeirloomTomatoTart from '../../pages/Order/images/Heirloom-Tomato-Tart.jpg';
import imgRackOfLamb from '../../pages/Order/images/Rack-of-Lamb.jpg';
import imgRoastedHeritageBeet from '../../pages/Order/images/Roasted-Heritage-Beet.jpg';
import imgSaffronPannaCotta from '../../pages/Order/images/Saffron-Panna-Cotta.jpg';
import imgSavoriaSignatureCocktail from '../../pages/Order/images/Savoria-Signature-Cocktail.jpg';
import imgSearedScallopAmuse from '../../pages/Order/images/Seared-Scallop-Amuse.jpg';
import imgSommeliersWhiteSelection from '../../pages/Order/images/Sommelier\\'s-White-Selection.jpg';
import imgTruffleArancini from '../../pages/Order/images/Truffle-Arancini.jpg';
import imgValrhonaChocolateSphere from '../../pages/Order/images/Valrhona-Chocolate-Sphere.jpg';
import imgWagyuBeefTartare from '../../pages/Order/images/Wagyu-Beef-Tartare.jpg';
import imgWildMushroomRisotto from '../../pages/Order/images/Wild-Mushroom-Risotto.jpg';
import imgYuzuTart from '../../pages/Order/images/Yuzu-Tart.jpg';

`;

data = imports + data;

const replacements = [
  { name: "'Artisan Still Water'", img: "imgArtisanStillWater" },
  { name: "'Braised A5 Wagyu Short Rib'", img: "imgBraisedA5WagyuShortRib" },
  { name: "'Butter-Poached Lobster'", img: "imgButterPoachedLobster" },
  { name: "'Cauliflower Steak'", img: "imgCauliflowerSteak" },
  { name: "\"Chef's Table Experience\"", img: "imgChefsTableExperience" },
  { name: "'Chilean Sea Bass'", img: "imgChileanSeaBass" },
  { name: "'Duck Confit'", img: "imgDuckConfit" },
  { name: "'Grilled Tiger Prawns'", img: "imgGrilledTigerPrawns" },
  { name: "'Heirloom Tomato Tart'", img: "imgHeirloomTomatoTart" },
  { name: "'Rack of Lamb'", img: "imgRackOfLamb" },
  { name: "'Roasted Heritage Beet'", img: "imgRoastedHeritageBeet" },
  { name: "'Saffron Panna Cotta'", img: "imgSaffronPannaCotta" },
  { name: "'Savoria Signature Cocktail'", img: "imgSavoriaSignatureCocktail" },
  { name: "'Seared Scallop Amuse'", img: "imgSearedScallopAmuse" },
  { name: "\"Sommelier's White Selection\"", img: "imgSommeliersWhiteSelection" },
  { name: "'Truffle Arancini'", img: "imgTruffleArancini" },
  { name: "'Valrhona Chocolate Sphere'", img: "imgValrhonaChocolateSphere" },
  { name: "'Wagyu Beef Tartare'", img: "imgWagyuBeefTartare" },
  { name: "'Wild Mushroom Risotto'", img: "imgWildMushroomRisotto" },
  { name: "'Yuzu Tart'", img: "imgYuzuTart" }
];

replacements.forEach(({ name, img }) => {
  const escapedName = name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  const regex = new RegExp(`(name:\\s*${escapedName},[\\s\\S]*?)image:\\s*null,`);
  data = data.replace(regex, `$1image: ${img},`);
});

fs.writeFileSync(file, data);
console.log('Done!');

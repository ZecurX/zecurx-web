const fs = require('fs');

const path = './public/lottie/service-main.json';
let dataStr = fs.readFileSync(path, 'utf8');
let data = JSON.parse(dataStr);

// #496ae8 -> RGB(73, 106, 232) -> [0.2862, 0.4156, 0.9098, 1]
const targetColor = [0.2862, 0.4156, 0.9098, 1];

let replacedCount = 0;

function traverse(obj) {
  if (Array.isArray(obj)) {
    if (obj.length === 4 && obj.every(v => typeof v === 'number' && v >= 0 && v <= 1)) {
      const [r, g, b, a] = obj;
      // Detect orange-ish or any brand color they might mean. Or just replace anything that isn't grayscale/white/dark blue
      // Orange: high R, medium G, low B
      if (r > 0.6 && g > 0.2 && g < 0.8 && b < 0.5) {
        obj[0] = targetColor[0];
        obj[1] = targetColor[1];
        obj[2] = targetColor[2];
        replacedCount++;
      }
      // Or maybe they meant the blue? If it's the "#4a6ffa" blue:
      if (r > 0.2 && r < 0.4 && g > 0.3 && g < 0.6 && b > 0.8) {
        obj[0] = targetColor[0];
        obj[1] = targetColor[1];
        obj[2] = targetColor[2];
        replacedCount++;
      }
    }
  }
  if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(traverse);
  }
}

traverse(data);
console.log(`Replaced ${replacedCount} color arrays in Lottie.`);

fs.writeFileSync(path, JSON.stringify(data));

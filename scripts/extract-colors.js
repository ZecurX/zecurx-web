const fs = require('fs');

const data = require('./public/lottie/service-main.json');
const colors = new Set();

function traverse(obj) {
  if (Array.isArray(obj)) {
    // Check if it's a color array (length 4, values between 0 and 1)
    if (obj.length === 4 && obj.every(v => typeof v === 'number' && v >= 0 && v <= 1)) {
      // It's likely a color
      colors.add(JSON.stringify(obj.map(n => Math.round(n * 255))));
    }
    // Check if it's RGB array (length 3, values 0-255 or 0-1)
    if (obj.length === 3 && obj.every(v => typeof v === 'number')) {
        if (obj.every(v => v >= 0 && v <= 1)) {
            colors.add(JSON.stringify(obj.map(n => Math.round(n * 255))));
        } else if (obj.every(v => v >= 0 && v <= 255)) {
            colors.add(JSON.stringify(obj));
        }
    }
    obj.forEach(traverse);
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(traverse);
  }
}

traverse(data);
console.log("Found colors (RGB 0-255):");
console.log(Array.from(colors));

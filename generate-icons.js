const { createCanvas } = require('canvas');
const fs = require('fs');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a1200');
  grad.addColorStop(1, '#080a0d');
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = 'rgba(245,158,11,0.4)';
  ctx.lineWidth = size * 0.04;
  ctx.roundRect(size*0.04, size*0.04, size*0.92, size*0.92, size * 0.18);
  ctx.stroke();
  
  // Lightning bolt ⚡
  ctx.fillStyle = '#f59e0b';
  ctx.font = `bold ${size * 0.55}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡', size/2, size/2);
  
  return canvas.toBuffer('image/png');
}

[16, 48, 128].forEach(size => {
  fs.writeFileSync(`public/icon${size}.png`, createIcon(size));
  console.log(`Created icon${size}.png`);
});

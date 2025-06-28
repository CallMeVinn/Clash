const { createCanvas, loadImage } = require('@napi-rs/canvas');

const imageUrl = 'https://cdn.discordapp.com/emojis/873631287791997008.png';

const troops = require("../../@assets/json/troops.json");

module.exports = {
    data: {
        type: 1,
        name: "ctx",
        description: "Command Line Interface"
    },
    private: true,
    async execute(i) {
        await i.deferReply();
        
        const pl = await i.coc.getPlayer("#PVQ2UYCPC");
        const pasukan = p.troops.map(t=>t.level);
        const cols = 5;
  const cellSize = 128;
  const padding = 20;
  const levelCircleRadius = 22;
  const canvasWidth = cols * cellSize + (cols + 1) * padding;
  const rows = Math.ceil(pasukan.length / cols);
  const canvasHeight = rows * cellSize + (rows + 1) * padding;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const img = await loadImage(imageUrl);

  for (let i = 0; i < troops.length; i++) {
    const level = pasukan[i];
    const row = Math.floor(i / cols);
    const col = i % cols;

    const x = padding + col * (cellSize + padding);
    const y = padding + row * (cellSize + padding);

    ctx.save();
    if (level === 0) ctx.globalAlpha = 0.4;
    // Border beveled
const borderRadius = 20;
const gradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
gradient.addColorStop(0, '#2b2b2b');
gradient.addColorStop(1, '#444');

ctx.beginPath();
roundedRect(ctx, x - 4, y - 4, cellSize + 8, cellSize + 8, borderRadius);
ctx.fillStyle = gradient;
ctx.shadowColor = '#00000088';
ctx.shadowBlur = 8;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.fill();
ctx.shadowColor = 'transparent'; // Reset shadow
    ctx.drawImage(img, x, y, cellSize, cellSize);
    ctx.restore();

    if (level > 0) {
      let color = '#0077ff';
      if (level >= 9) color = '#ffaa00';
      if (level <= 3) color = '#ff0044';

      // Level circle
ctx.beginPath();
ctx.arc(x + cellSize - 28, y + 28, levelCircleRadius, 0, Math.PI * 2);
ctx.fillStyle = color;
ctx.fill();

// Border putih di lingkaran (opsional)
ctx.lineWidth = 3;
ctx.strokeStyle = '#ffffff';
ctx.stroke();

// Level text di tengah
ctx.font = 'bold 22px Sans';
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(level.toString(), x + cellSize - 28, y + 28);
    }
  }

  await i.editReply({ files: [{attachment: canvas.toBuffer('image/png'), name: "c.png" }] });
    }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
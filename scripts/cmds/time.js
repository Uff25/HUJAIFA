const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "time",
  version: "11.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  countDown: 5,
  role: 0,
  shortDescription: "Calendar up time card",
  category: "fun",
  guide: { en: "{p}time" }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  try {
    const now = new Date();
    const dhakaOffset = 6 * 60 * 60 * 1000;
    const dhakaTime = new Date(now.getTime() + dhakaOffset);

    const year = dhakaTime.getFullYear();
    const month = dhakaTime.getMonth();
    const date = dhakaTime.getDate();
    const day = dhakaTime.getDay();
    let hours = dhakaTime.getHours();
    const minutes = dhakaTime.getMinutes();
    const seconds = dhakaTime.getSeconds();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    const dayName = days[day];
    const monthName = months[month];

    const avatarUrl = `https://graph.facebook.com/${senderID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const filePath = await generateUpCard({
      year, month, date, dayName, monthName, timeStr, avatarUrl
    });

    await api.sendMessage({
      body: `🗓️ ${dayName}, ${date} ${monthName} ${year}\n⏰ ${timeStr}\n🌐 BDT (GMT+6)`,
      attachment: fs.createReadStream(filePath)
    }, threadID, messageID);

    setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 10000);

  } catch (error) {
    console.error(error);
    api.sendMessage("Error!", threadID, messageID);
  }
};

async function generateUpCard(data) {
  const width = 850;
  const height = 950;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 600);
  bgGradient.addColorStop(0, '#1a0b2e');
  bgGradient.addColorStop(0.5, '#11051f');
  bgGradient.addColorStop(1, '#05010a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.shadowColor = 'rgba(255, 0, 128, 0.4)';
  ctx.shadowBlur = 50;
  drawHeart3D(ctx, width / 2 - 180, height / 2 - 80, 120);
  drawHeart3D(ctx, width / 2 + 180, height / 2 - 80, 120);
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = 'rgba(0, 255, 204, 0.15)';
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 280, 0, Math.PI * 2);
  ctx.stroke();

  const margin = 40;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  
  ctx.strokeStyle = '#8a9ba8';
  ctx.lineWidth = 16;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 20;
  roundRect(ctx, margin, margin, cardW, cardH, 40, false, true);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  roundRect(ctx, margin + 8, margin + 8, cardW - 16, cardH - 16, 32, false, true);
  ctx.shadowColor = 'transparent';

  drawTeddyBear(ctx, margin + 40, margin + 40, 0.8);
  drawTeddyBear(ctx, width - margin - 40, margin + 40, 0.8);
  drawTeddyBear(ctx, margin + 40, height - margin - 40, 0.8);
  drawTeddyBear(ctx, width - margin - 40, height - margin - 40, 0.8);

  try {
    const avatar = await loadImage(data.avatarUrl);
    const avX = 120;
    const avY = 160;
    const avR = 45;

    ctx.save();
    ctx.lineWidth = 4;
    
    ctx.strokeStyle = '#ff0055';
    ctx.beginPath();
    ctx.arc(avX, avY, avR + 9, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(avX, avY, avR + 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(avX, avY, avR + 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(avX, avY, avR, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, avX - avR, avY - avR, avR * 2, avR * 2);
    ctx.restore();
  } catch (e) {
    console.error("Avatar error", e);
  }

  ctx.font = '900 68px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 30;
  ctx.fillText(data.timeStr, width / 2 + 60, 160);

  ctx.font = '900 60px "Arial"';
  ctx.fillStyle = '#ff007f';
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 30;
  ctx.fillText(data.dayName, width / 2, 250);

  ctx.font = '900 42px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.fillText(`${data.date} ${data.monthName} ${data.year}`, width / 2, 320);

  ctx.font = '900 36px "Arial"';
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const headerY = 390;
  const cellWidth = 95;
  const startX = (width - 7 * cellWidth) / 2 + 47.5;
  
  weekDays.forEach((d, i) => {
    const x = startX + i * cellWidth;
    ctx.fillStyle = (i === 0 || i === 6) ? '#ff3366' : '#00ffcc';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    ctx.fillText(d, x, headerY);
  });
  ctx.shadowColor = 'transparent';

  const firstDay = new Date(data.year, data.month, 1).getDay();
  const daysInMonth = new Date(data.year, data.month + 1, 0).getDate();

  const gridStartY = 460;
  const rowHeight = 70;
  let dayCount = 1;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      if (cellIndex < firstDay) continue;
      if (dayCount > daysInMonth) break;

      const x = startX + col * cellWidth;
      const y = gridStartY + row * rowHeight;

      if (dayCount === data.date) {
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.arc(x, y, 38, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = '900 46px "Arial"';
        ctx.shadowBlur = 0;
        ctx.fillText(dayCount, x, y);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 40px "Arial"';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
        ctx.fillText(dayCount, x, y);
      }
      dayCount++;
    }
    if (dayCount > daysInMonth) break;
  }

  ctx.font = '900 55px "Arial"';
  ctx.fillStyle = '#00ffff';
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 25;
  ctx.fillText('SIYAM HASAN', width / 2, height - 85);
  ctx.shadowColor = 'transparent';

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  const filePath = path.join(cacheDir, `time_up_${Date.now()}.png`);
  fs.writeFileSync(filePath, canvas.toBuffer());
  return filePath;
}

function roundRect(ctx, x, y, w, h, r, fill = false, stroke = false) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function drawHeart3D(ctx, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.quadraticCurveTo(x, y, x - size / 2, y);
  ctx.quadraticCurveTo(x - size, y, x - size, y + size / 2);
  ctx.quadraticCurveTo(x - size, y + size, x, y + size * 1.3);
  ctx.quadraticCurveTo(x + size, y + size, x + size, y + size / 2);
  ctx.quadraticCurveTo(x + size, y, x + size / 2, y);
  ctx.quadraticCurveTo(x, y, x, y + size / 4);
  
  const grad = ctx.createLinearGradient(x - size, y, x + size, y + size);
  grad.addColorStop(0, '#ff007f');
  grad.addColorStop(1, '#7900ff');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawTeddyBear(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#ff99bb';
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.arc(-22, -22, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(22, -22, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 5, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(-9, -5, 3.5, 0, Math.PI * 2);
  ctx.arc(9, -5, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const { commands } = global.GoatBot;
const axios = require("axios");
const moment = require("moment-timezone");
const os = require("os");
const util = require("util");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const exec = util.promisify(require("child_process").exec);

module.exports = {
  config: {
    name: "botinfo",
    aliases: ["botinf", "infobot", "binfo"],
    version: "3.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: "Bot information card"
    },
    longDescription: {
      en: "Get bot and system information in a dark card theme"
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, api }) {
    let loadingMsg;
    try {
      loadingMsg = await message.reply("⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭... 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐁𝐨𝐭 𝐈𝐧𝐟𝐨 𝐂𝐚𝐫𝐝!");

      const timeStart = Date.now();
      const ping = Date.now() - timeStart;

      const now = moment().tz("Asia/Dhaka");
      const date = now.format("MMMM DD YYYY");
      const time = now.format("h:mm:ss A");

      const boxPrefix = global.utils.getPrefix(event.threadID);
      const uptime = process.uptime();
      const botUptime = formatMilliseconds(uptime * 1000);

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const diskUsage = await getDiskUsage();

      const systemInfo = {
        os: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        cpu: `${os.cpus()[0].model} (${os.cpus().length} cores)`,
        botUptime,
        serverUptime: formatUptime(os.uptime())
      };

      let speed = "N/A";
      try {
        const FastSpeedtest = require("fast-speedtest-api");
        const speedTest = new FastSpeedtest({
          token: "fast",
          verbose: false,
          timeout: 10000,
          https: true,
          urlCount: 5,
          bufferSize: 8,
          unit: FastSpeedtest.UNITS.Mbps
        });
        speed = await speedTest.getSpeed();
        speed = Number(speed).toFixed(2);
      } catch (e) {
        speed = "N/A";
      }

      const botName = global.GoatBot.config.nickNameBot || "GoatBot";
      const prefix = global.GoatBot.config.prefix;

      let userName = "User";
      try {
        const userInfo = await api.getUserInfo(event.senderID);
        userName = userInfo[event.senderID].name;
      } catch (e) {}

      let avatarBuffer;
      try {
        const pfpUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const pfpRes = await axios.get(pfpUrl, { responseType: "arraybuffer" });
        avatarBuffer = pfpRes.data;
      } catch (e) {
        avatarBuffer = null;
      }

      const canvasWidth = 1200;
      const canvasHeight = 1650;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const heartColors = ["#ff0055", "#e040fb", "#7928ca", "#ff0080"];
      const heartPositions = [
        { x: 100, y: 150, size: 0.6, color: heartColors[0], opacity: 0.12 },
        { x: 1100, y: 200, size: 0.8, color: heartColors[1], opacity: 0.15 },
        { x: 200, y: 800, size: 0.5, color: heartColors[2], opacity: 0.10 },
        { x: 1000, y: 950, size: 0.7, color: heartColors[3], opacity: 0.12 },
        { x: 150, y: 1500, size: 0.9, color: heartColors[0], opacity: 0.15 },
        { x: 1050, y: 1450, size: 0.6, color: heartColors[1], opacity: 0.10 }
      ];

      heartPositions.forEach(h => {
        drawHeart(ctx, h.x, h.y, h.size, h.color, h.opacity);
      });

      drawCard(ctx, 40, 40, 1120, 220, 25, "rgba(20, 20, 30, 0.85)", "#ff0077", 3);

      const avatarCX = 150;
      const avatarCY = 150;
      const avatarR = 75;

      const ringColors = ["#ff0055", "#ff7700", "#ffdd00", "#00ff66", "#00ffff", "#0088ff", "#9900ff", "#ff00cc"];
      const segAngle = (Math.PI * 2) / ringColors.length;
      for (let i = 0; i < ringColors.length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCX, avatarCY, avatarR + 8, i * segAngle, (i + 1) * segAngle + 0.05);
        ctx.strokeStyle = ringColors[i];
        ctx.lineWidth = 8;
        ctx.shadowColor = ringColors[i];
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      if (avatarBuffer) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCX, avatarCY, avatarR, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const img = await loadImage(avatarBuffer);
        ctx.drawImage(img, avatarCX - avatarR, avatarCY - avatarR, avatarR * 2, avatarR * 2);
        ctx.restore();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      ctx.fillText(userName, 260, 130);

      ctx.fillStyle = "#ff0077";
      ctx.font = "bold 26px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      ctx.fillText("👑 BOT OWNER: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", 260, 175);

      const cardData = [
        { label: "🤖 BOT NAME", val: botName, color: "#00f3ff" },
        { label: "⚡ BOT PREFIX", val: prefix, color: "#e040fb" },
        { label: "📡 BOT PING", val: `${ping} ms`, color: "#00e676" },
        { label: "⏱️ BOT UPTIME", val: botUptime, color: "#ff9100" },
        { label: "📜 TOTAL COMMANDS", val: `${commands.size}`, color: "#ffd600" },
        { label: "💻 SYSTEM OS", val: systemInfo.os, color: "#2979ff" },
        { label: "🧠 CPU MODEL", val: systemInfo.cpu, color: "#f50057" },
        { label: "🕒 TIME & DATE", val: `${time} | ${date}`, color: "#76ff03" },
        { label: "🚀 SPEED", val: `${speed} Mbps`, color: "#ff1744" },
        { label: "🖥️ SERVER UPTIME", val: systemInfo.serverUptime, color: "#00b0ff" },
        { label: "📊 RAM USAGE", val: `${prettyBytes(totalMemory - freeMemory)} / ${prettyBytes(totalMemory)}`, color: "#ff3d00" },
        { label: "💾 DISK USAGE", val: `${prettyBytes(diskUsage.used)} / ${prettyBytes(diskUsage.total)}`, color: "#d500f9" }
      ];

      let startY = 300;
      const cardW = 540;
      const cardH = 180;

      for (let i = 0; i < cardData.length; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 40 + col * 580;
        const y = startY + row * 210;

        const item = cardData[i];
        drawCard(ctx, x, y, cardW, cardH, 20, "rgba(18, 18, 28, 0.9)", item.color, 2);

        ctx.fillStyle = item.color;
        ctx.font = "bold 28px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        ctx.fillText(item.label, x + 25, y + 55);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        
        let textVal = item.val;
        if (ctx.measureText(textVal).width > cardW - 50) {
          ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        }
        if (ctx.measureText(textVal).width > cardW - 50) {
          textVal = textVal.substring(0, 32) + "...";
        }

        ctx.fillText(textVal, x + 25, y + 120);
      }

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, `botinfo_${event.senderID}_${Date.now()}.png`);
      fs.writeFileSync(imagePath, canvas.toBuffer("image/png"));

      if (loadingMsg && loadingMsg.messageID) {
        api.unsendMessage(loadingMsg.messageID);
      }

      await message.reply(
        {
          attachment: fs.createReadStream(imagePath)
        },
        () => {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      );

    } catch (err) {
      console.error(err);
      if (loadingMsg && loadingMsg.messageID) {
        api.unsendMessage(loadingMsg.messageID);
      }
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};

function drawCard(ctx, x, y, w, h, r, fillColor, strokeColor, lineWidth) {
  ctx.save();
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

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  ctx.restore();
}

function drawHeart(ctx, x, y, scale, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x, y - 3 * scale, x - 5 * scale, y - 15 * scale, x - 25 * scale, y - 15 * scale);
  ctx.bezierCurveTo(x - 55 * scale, y - 15 * scale, x - 55 * scale, y + 22.5 * scale, x - 55 * scale, y + 22.5 * scale);
  ctx.bezierCurveTo(x - 55 * scale, y + 40 * scale, x - 35 * scale, y + 62 * scale, x, y + 80 * scale);
  ctx.bezierCurveTo(x + 35 * scale, y + 62 * scale, x + 55 * scale, y + 40 * scale, x + 55 * scale, y + 22.5 * scale);
  ctx.bezierCurveTo(x + 55 * scale, y + 22.5 * scale, x + 55 * scale, y - 15 * scale, x + 25 * scale, y - 15 * scale);
  ctx.bezierCurveTo(x + 10 * scale, y - 15 * scale, x, y - 3 * scale, x, y);
  ctx.fill();
  ctx.restore();
}

async function getDiskUsage() {
  try {
    const { stdout } = await exec("df -k /");
    const parts = stdout.split("\n")[1].split(/\s+/).filter(Boolean);
    return {
      total: parseInt(parts[1]) * 1024,
      used: parseInt(parts[2]) * 1024
    };
  } catch (e) {
    return { total: 0, used: 0 };
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}D ${hours}H ${minutes}M ${secs}S`;
}

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}H ${minutes % 60}M ${seconds % 60}S`;
}

function prettyBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

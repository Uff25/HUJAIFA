const { commands } = global.GoatBot;
const axios = require("axios");
const moment = require("moment-timezone");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { createCanvas, loadImage } = require("canvas");

function toBold(text) {
  if (text === undefined || text === null) return "";
  return String(text).replace(/[A-Za-z0-9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + (code - 48));
    return char;
  });
}

module.exports = {
  config: {
    name: "botinfo",
    aliases: ["botinf", "infobot", "binfo"],
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: toBold("Bot information")
    },
    longDescription: {
      en: toBold("Get bot and system information")
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, api, threadsData }) {
    try {
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
        cpu: `\( {os.cpus()[0].model} ( \){os.cpus().length} cores)`,
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

      const info = {
        name: global.GoatBot.config.nickNameBot || "GoatBot",
        prefix: global.GoatBot.config.prefix,
        boxPrefix
      };

      // ===== CREATE BEAUTIFUL CARD =====
      const width = 900;
      const height = 1200;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Dark black + love gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#0a0a0f");
      bgGrad.addColorStop(0.5, "#120810");
      bgGrad.addColorStop(1, "#0d0510");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft floating hearts (love theme)
      ctx.globalAlpha = 0.12;
      const hearts = ["♥", "♡", "❤", "💕"];
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#ff4d6d" : "#ff85a2";
        ctx.font = `${20 + Math.random() * 30}px Arial`;
        ctx.fillText(hearts[i % 4], Math.random() * width, Math.random() * height);
      }
      ctx.globalAlpha = 1;

      // Outer card border glow
      ctx.strokeStyle = "#ff2d55";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 25;
      roundRect(ctx, 25, 25, width - 50, height - 50, 40);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner dark card
      ctx.fillStyle = "rgba(10, 8, 15, 0.92)";
      roundRect(ctx, 40, 40, width - 80, height - 80, 32);
      ctx.fill();

      // ===== PROFILE PIC + 8-COLOR GLOWING RING =====
      const avatarSize = 180;
      const avatarX = width / 2;
      const avatarY = 180;

      // 8 different neon colors for the ring
      const ringColors = [
        "#ff2d55", "#ff6b35", "#ffd60a", "#06d6a0",
        "#118ab2", "#7b2cbf", "#e0aaff", "#ff85a2"
      ];

      // Draw multi-color glowing ring (8 segments)
      const ringRadius = avatarSize / 2 + 14;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const start = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const end = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
        ctx.arc(avatarX, avatarY, ringRadius, start, end);
        ctx.strokeStyle = ringColors[i];
        ctx.lineWidth = 10;
        ctx.shadowColor = ringColors[i];
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Second soft outer glow
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, ringRadius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 45, 85, 0.35)";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Load & draw circular avatar
      try {
        const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`;
        const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        const avatar = await loadImage(Buffer.from(res.data));

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
        ctx.restore();
      } catch (e) {
        // Fallback circle if avatar fails
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a2e";
        ctx.fill();
        ctx.fillStyle = "#ff2d55";
        ctx.font = "bold 70px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", avatarX, avatarY);
      }

      // Title
      ctx.font = "bold 42px Arial";
      ctx.fillStyle = "#ff2d55";
      ctx.textAlign = "center";
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 12;
      ctx.fillText("BOT INFORMATION", width / 2, 320);
      ctx.shadowBlur = 0;

      // Decorative line under title
      ctx.strokeStyle = "#ff2d55";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(180, 345);
      ctx.lineTo(width - 180, 345);
      ctx.stroke();

      // ===== INFO LIST (big text + unique colors) =====
      const infos = [
        { label: "BOT NAME", value: info.name, color: "#ff6b9d" },
        { label: "BOT PREFIX", value: info.prefix, color: "#ffd60a" },
        { label: "BOX PREFIX", value: info.boxPrefix, color: "#06d6a0" },
        { label: "BOT PING", value: `${ping} ms`, color: "#118ab2" },
        { label: "BOT UPTIME", value: systemInfo.botUptime, color: "#e0aaff" },
        { label: "TOTAL COMMANDS", value: `${commands.size}`, color: "#ff85a2" },
        { label: "OS", value: systemInfo.os, color: "#ff6b35" },
        { label: "ARCH", value: systemInfo.arch, color: "#7b2cbf" },
        { label: "CPU", value: systemInfo.cpu.length > 38 ? systemInfo.cpu.slice(0, 36) + "..." : systemInfo.cpu, color: "#06d6a0" },
        { label: "TIME", value: time, color: "#ffd60a" },
        { label: "DATE", value: date, color: "#ff2d55" },
        { label: "SPEED", value: `${speed} Mbps`, color: "#118ab2" },
        { label: "SERVER UPTIME", value: systemInfo.serverUptime, color: "#e0aaff" },
        { label: "RAM USAGE", value: prettyBytes(totalMemory - freeMemory), color: "#ff6b9d" },
        { label: "TOTAL RAM", value: prettyBytes(totalMemory), color: "#06d6a0" },
        { label: "DISK USED", value: prettyBytes(diskUsage.used), color: "#ff85a2" },
        { label: "DISK TOTAL", value: prettyBytes(diskUsage.total), color: "#ffd60a" }
      ];

      let y = 390;
      infos.forEach((item, index) => {
        // Label
        ctx.font = "bold 22px Arial";
        ctx.fillStyle = "#aaaaaa";
        ctx.textAlign = "left";
        ctx.fillText(item.label, 90, y);

        // Value (big + unique color)
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = item.color;
        ctx.textAlign = "right";
        ctx.fillText(item.value, width - 90, y);

        // Soft separator line
        if (index < infos.length - 1) {
          ctx.strokeStyle = "rgba(255, 45, 85, 0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(90, y + 18);
          ctx.lineTo(width - 90, y + 18);
          ctx.stroke();
        }
        y += 42;
      });

      // Owner section
      ctx.font = "bold 26px Arial";
      ctx.fillStyle = "#ff2d55";
      ctx.textAlign = "center";
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 10;
      ctx.fillText("👑  BOT OWNER  👑", width / 2, height - 95);
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", width / 2, height - 55);
      ctx.shadowBlur = 0;

      // Send the card
      const stream = canvas.createPNGStream();
      await message.reply({
        body: toBold("✨ Bot Information Card ✨"),
        attachment: stream
      });

    } catch (err) {
      console.log(err);
      message.reply(toBold(`❌ Error:\n${err.message}`));
    }
  }
};

async function getDiskUsage() {
  try {
    const { stdout } = await exec("df -k /");
    const parts = stdout
      .split("\n")[1]
      .split(/\s+/)
      .filter(Boolean);
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

function roundRect(ctx, x, y, w, h, r) {
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
}

const os = require("os");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "upinfo",
    version: "15.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "system",
    usePrefix: false
  },

  onStart: async function ({ api, event, message }) {

    const width = 1000;
    const height = 580;

    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `final_${Date.now()}.png`);

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const wait = await message.reply("⚡ Creating Ultra-Premium Chill Card...");

    try {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#0a0a16");
      bg.addColorStop(0.5, "#121124");
      bg.addColorStop(1, "#050714");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 550);
      radialGlow.addColorStop(0, "rgba(255, 0, 128, 0.15)");
      radialGlow.addColorStop(0.5, "rgba(0, 247, 255, 0.1)");
      radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      const borderGlow = ctx.createLinearGradient(30, 30, 970, 550);
      borderGlow.addColorStop(0.0, "#ff0055");
      borderGlow.addColorStop(0.12, "#ff5500");
      borderGlow.addColorStop(0.25, "#ffcc00");
      borderGlow.addColorStop(0.37, "#33ff00");
      borderGlow.addColorStop(0.50, "#00ffcc");
      borderGlow.addColorStop(0.62, "#0099ff");
      borderGlow.addColorStop(0.75, "#7700ff");
      borderGlow.addColorStop(0.87, "#ff00cc");
      borderGlow.addColorStop(1.0, "#ff0055");

      ctx.save();
      ctx.shadowColor = "#00f7ff";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = borderGlow;
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, 940, 520);
      ctx.restore();

      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(34, 34, 932, 512);

      const titleGrad = ctx.createLinearGradient(60, 0, 500, 0);
      titleGrad.addColorStop(0, "#00f7ff");
      titleGrad.addColorStop(0.5, "#ff00cc");
      titleGrad.addColorStop(1, "#ffe600");

      ctx.font = "black 44px sans-serif";
      ctx.fillStyle = titleGrad;
      ctx.shadowColor = "#ff00cc";
      ctx.shadowBlur = 10;
      ctx.fillText("✨ NIJHUM BOT SYSTEM ✨", 60, 90);
      ctx.shadowBlur = 0;

      const uptime = process.uptime();
      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);

      const stats = [
        { label: `🌐 Host: ${os.platform()}`, color: "#00ffff", bg: "rgba(0, 255, 255, 0.12)", border: "#00ffff" },
        { label: `⚙️ OS: ${os.platform()} (${os.arch()})`, color: "#ff9900", bg: "rgba(255, 153, 0, 0.12)", border: "#ff9900" },
        { label: `⏳ Uptime: ${d}d ${h}h ${m}m`, color: "#00ff66", bg: "rgba(0, 255, 102, 0.12)", border: "#00ff66" },
        { label: `🧠 RAM: ${(os.totalmem() / 1e9).toFixed(2)} GB`, color: "#ff0099", bg: "rgba(255, 0, 153, 0.12)", border: "#ff0099" },
        { label: `📡 Ping: ${Date.now() - event.timestamp} ms`, color: "#ffff00", bg: "rgba(255, 255, 0, 0.12)", border: "#ffff00" },
        { label: `🟢 Node: ${process.version}`, color: "#cc66ff", bg: "rgba(204, 102, 255, 0.12)", border: "#cc66ff" }
      ];

      let y = 135;
      stats.forEach(item => {
        ctx.fillStyle = item.bg;
        ctx.strokeStyle = item.border;
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(60, y, 600, 48, 12);
        } else {
          ctx.rect(60, y, 600, 48);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = item.color;
        ctx.fillText(item.label, 80, y + 33);

        y += 58;
      });

      const footerGrad = ctx.createLinearGradient(60, 0, 500, 0);
      footerGrad.addColorStop(0, "#00ffcc");
      footerGrad.addColorStop(1, "#ff007f");

      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = footerGrad;
      ctx.fillText("⚡ POWERED BY SIYAM HASAN", 60, 510);

      const imgUrl = "https://files.catbox.moe/41hfau.jpg";
      const imgBuffer = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
      const profile = await loadImage(imgBuffer);

      const circleX = 790;
      const circleY = 280;
      const radius = 105;

      const ringGrad = ctx.createConicGradient ? ctx.createConicGradient(0, circleX, circleY) : ctx.createLinearGradient(circleX - radius, circleY - radius, circleX + radius, circleY + radius);
      if (ctx.createConicGradient) {
        ringGrad.addColorStop(0, "#ff007f");
        ringGrad.addColorStop(0.5, "#7700ff");
        ringGrad.addColorStop(1, "#00f7ff");
      } else {
        ringGrad.addColorStop(0, "#ff007f");
        ringGrad.addColorStop(0.5, "#7700ff");
        ringGrad.addColorStop(1, "#00f7ff");
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 7;
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(profile, circleX - radius, circleY - radius, radius * 2, radius * 2);
      ctx.restore();

      fs.writeFileSync(filePath, canvas.toBuffer());

      api.unsendMessage(wait.messageID);

      await message.reply({
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error creating premium card!");
    }
  }
};

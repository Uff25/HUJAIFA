const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "wish",
    version: "3.0.0",
    author: "SIYAM HASAN",
    countDown: 5,
    role: 0,
    shortDescription: "Generate a HD Birthday Wish Card",
    longDescription: "Creates a ultra-hd birthday wish card with avatar, real Facebook name, golden frame, and custom wishes.",
    category: "fun",
    guide: {
      en: "{p}ws [@mention | reply to a message | leave blank]"
    }
  },

  onStart: async function ({ api, event }) {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const imagePath = path.join(cacheDir, `birthday_${event.threadID}_${Date.now()}.png`);

    let targetID = "";
    let targetName = "";
    let senderName = "";

    try {
      const senderData = await api.getUserInfo(event.senderID);
      senderName = senderData[event.senderID]?.name || senderData[event.senderID]?.fullName || "Your Friend";

      if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } else {
        targetID = event.senderID;
      }

      const targetData = await api.getUserInfo(targetID);
      targetName = targetData[targetID]?.name || targetData[targetID]?.fullName || "Dear Friend";

      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=800&width=800&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      let avatarImage;
      try {
        avatarImage = await loadImage(avatarUrl);
      } catch (e) {
        try {
          avatarImage = await loadImage(`https://graph.facebook.com/${targetID}/picture?type=large`);
        } catch (err) {
          avatarImage = await loadImage("https://i.ibb.co/3pQ0X4G/default-avatar.png");
        }
      }

      const canvas = createCanvas(1200, 850);
      const ctx = canvas.getContext("2d");

      const bgGrad = ctx.createRadialGradient(600, 425, 100, 600, 425, 750);
      bgGrad.addColorStop(0, "#3A0057");
      bgGrad.addColorStop(0.5, "#1F0033");
      bgGrad.addColorStop(1, "#0A0012");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 850);

      for (let i = 0; i < 110; i++) {
        const x = Math.random() * 1200;
        const y = Math.random() * 850;
        const size = Math.random() * 3.5 + 1;
        const alpha = Math.random() * 0.8 + 0.2;
        const colors = ["#FFD700", "#FF69B4", "#00FFFF", "#FFFFFF", "#FF4500"];
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      ctx.lineWidth = 22;
      const borderGrad = ctx.createLinearGradient(0, 0, 1200, 850);
      borderGrad.addColorStop(0, "#FFD700");
      borderGrad.addColorStop(0.2, "#FFF8DC");
      borderGrad.addColorStop(0.5, "#DAA520");
      borderGrad.addColorStop(0.8, "#FFD700");
      borderGrad.addColorStop(1, "#B8860B");
      ctx.strokeStyle = borderGrad;
      ctx.strokeRect(25, 25, 1150, 800);

      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.strokeRect(40, 40, 1120, 770);

      const centerX = 600;
      const centerY = 290;
      const avatarRadius = 155;

      ctx.save();
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(centerX, centerY, avatarRadius + 15, 0, Math.PI * 2);
      ctx.fillStyle = borderGrad;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, avatarRadius + 5, 0, Math.PI * 2);
      ctx.fillStyle = "#0A0012";
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImage, centerX - avatarRadius, centerY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();

      ctx.textAlign = "center";

      ctx.font = "bold 50px sans-serif";
      ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
      ctx.shadowBlur = 20;
      ctx.fillText("🎉 HAPPY BIRTHDAY 🎉", 600, 510);

      ctx.font = "bold 65px sans-serif";
      const nameGrad = ctx.createLinearGradient(0, 530, 1200, 600);
      nameGrad.addColorStop(0, "#FFFFFF");
      nameGrad.addColorStop(0.3, "#FFF8DC");
      nameGrad.addColorStop(0.7, "#FFD700");
      nameGrad.addColorStop(1, "#FF8C00");
      ctx.fillStyle = nameGrad;
      ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
      ctx.shadowBlur = 25;
      ctx.fillText(targetName.toUpperCase(), 600, 595);

      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#E0E6ED";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 10;
      ctx.fillText("WISHING YOU A DAY FILLED WITH LOVE, JOY & HAPPINESS!", 600, 660);

      ctx.beginPath();
      ctx.moveTo(300, 700);
      ctx.lineTo(900, 700);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
      ctx.stroke();

      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = "#00FFFF";
      ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
      ctx.shadowBlur = 12;
      ctx.fillText("👑 OWNER ➜ SIYAM-HASAN 👑", 600, 760);

      const buffer = canvas.toBuffer("image/png");
      await fs.writeFile(imagePath, buffer);

      const wishText = `🎉✦ 𝗛𝗔𝗣𝗣𝗬 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 ✦

❖ Dear ${targetName},

আজকের দিনটি তোমার জীবনের অন্যতম সুন্দর একটি দিন।
শুভ জন্মদিন! 🎂

◈ তোমার প্রতিটি স্বপ্ন পূরণ হোক।
◈ জীবন ভরে উঠুক সুখ, শান্তি ও সফলতায়।
◈ প্রতিটি নতুন দিন বয়ে আনুক আনন্দ ও আশীর্বাদ।

🤲 আল্লাহ তোমাকে সুস্থতা, দীর্ঘ নেক হায়াত,
হালাল রিজিক ও সুন্দর ভবিষ্যৎ দান করুন। আমীন।

✦ 𝗠𝗮𝗻𝘆 𝗛𝗮𝗽𝗽𝘆 𝗥𝗲𝘁𝘂𝗿𝗻𝘀 𝗢𝗳 𝗧𝗵𝗲 𝗗𝗮𝘆 ✦

— 𝗕𝗲𝘀𝘁 𝗪𝗶𝘀𝗵𝗲𝘀
${senderName}

👑  𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;

      await api.sendMessage(
        {
          body: wishText,
          attachment: fs.createReadStream(imagePath)
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      return api.sendMessage("❌ বার্থডে উইশ কার্ড তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    } finally {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
  }
};

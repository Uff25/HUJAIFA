const fs = require("fs-extra");
const axios = require("axios");
const canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
  name: "brain",
  version: "1.0.4",
  role: 0,
  author: "ARIYAN SABBIR",
  category: "image",
  shortDescription: {
    en: "Scooby Doo template meme"
  },
  description: {
    en: "Create a meme using a user's profile picture"
  },
  guide: {
    en: "{pn} [@mention] or reply to a message"
  },
  cooldown: 5
},

  onStart: async function ({ event, api }) {
    const TEMPLATES = [
      {
        url: "https://i.imgur.com/MjSL6yI.jpeg",
        ref: { w: 1083, h: 1452 },
        avatar: { x: 78, y: 1010, size: 300 }
      }
    ];

    const cacheDir = path.join(__dirname, "cache");
    const outputPath = path.join(
      cacheDir,
      `rip_${Date.now()}.jpg`
    );

    try {
      await fs.ensureDir(cacheDir);

      // Mention > replied user > command sender
      const targetUserId =
        Object.keys(event.mentions || {})[0] ||
        (event.messageReply &&
          event.messageReply.senderID) ||
        event.senderID;

      const tpl =
        TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

      // Download template
      const templateRes = await axios.get(tpl.url, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 20000
      });

      const templateImage = await canvas.loadImage(
        Buffer.from(templateRes.data)
      );

      // Get user's profile picture
      let picData;

      try {
        const picRes = await axios.get(
          `https://graph.facebook.com/${targetUserId}/picture?width=512&height=512`,
          {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000
          }
        );

        picData = picRes.data;
      } catch (err) {
        const info = await new Promise((resolve, reject) => {
          api.getUserInfo(targetUserId, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
        });

        const thumb =
          info[targetUserId] &&
          info[targetUserId].thumbSrc;

        if (!thumb) {
          throw new Error("প্রোফাইল ছবি পাওয়া যায়নি!");
        }

        const fallback = await axios.get(thumb, {
          responseType: "arraybuffer",
          timeout: 15000
        });

        picData = fallback.data;
      }

      const avatar = await canvas.loadImage(
        Buffer.from(picData)
      );

      // Draw template
      const cv = canvas.createCanvas(
        templateImage.width,
        templateImage.height
      );

      const ctx = cv.getContext("2d");
      ctx.drawImage(templateImage, 0, 0);

      // Scale avatar position to actual template dimensions
      const scaleX = templateImage.width / tpl.ref.w;
      const scaleY = templateImage.height / tpl.ref.h;

      const ax = tpl.avatar.x * scaleX;
      const ay = tpl.avatar.y * scaleY;
      const aw = tpl.avatar.size * scaleX;
      const ah = tpl.avatar.size * scaleY;

      // Circular profile picture
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        ax + aw / 2,
        ay + ah / 2,
        Math.min(aw, ah) / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatar, ax, ay, aw, ah);
      ctx.restore();

      await fs.writeFile(
        outputPath,
        cv.toBuffer("image/jpeg")
      );

      // Send result
      api.sendMessage(
        {
          body: "তুই একটা বদল\nমাথায় গোবর-গু ছাড়া কিছু নাই🤣😹",
          attachment: fs.createReadStream(outputPath)
        },
        event.threadID,
        (err) => {
          if (fs.existsSync(outputPath)) {
            fs.unlink(outputPath).catch(() => {});
          }

          if (err) {
            console.error("[RIP] Send error:", err);
          }
        },
        event.messageID
      );
    } catch (error) {
      if (fs.existsSync(outputPath)) {
        await fs.unlink(outputPath).catch(() => {});
      }

      console.error("[RIP] Error:", error);

      return api.sendMessage(
        "❌ RIP কমান্ডে সমস্যা হয়েছে: " + error.message,
        event.threadID,
        event.messageID
      );
    }
  }
};

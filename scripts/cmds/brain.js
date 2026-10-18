const fs = require("fs-extra");
const axios = require("axios");
const canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "brain",
    version: "1.0.3",
    role: 0,
    author: "ARIYAN SABBIR",
    category: "Picture",
    shortDescription: {
      en: "scooby doo template memes"
    },
    description: {
      en: "scooby doo template memes"
    },
    guide: {
      en: "{pn} [@mention]"
    },
    cooldown: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": ""
    }
  },

  onStart: async function ({ event, api }) {
    const TEMPLATES = [
      {
        url: "https://i.imgur.com/MjSL6yI.jpeg",
        ref: { w: 1083, h: 1452 },
        avatar: { x: 78, y: 1010, size: 300 }
      }
    ];

    const tpl =
      TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

    const cacheDir = path.join(__dirname, "cache");
    const outputPath = path.join(
      cacheDir,
      "rip" + Date.now() + ".jpg"
    );

    try {
      await fs.ensureDir(cacheDir);

      // Mention > replied user > sender
      const targetUserId =
        Object.keys(event.mentions || {})[0] ||
        (event.type === "message_reply" &&
          event.messageReply &&
          event.messageReply.senderID) ||
        event.senderID;

      // Template image
      const templateRes = await axios.get(tpl.url, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const templateImage = await canvas.loadImage(
        Buffer.from(templateRes.data)
      );

      // Profile picture
      let picData;

      try {
        const picRes = await axios.get(
          `https://graph.facebook.com/${targetUserId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Mozilla/5.0" }
          }
        );

        picData = picRes.data;
      } catch (e) {
        // Backup: getUserInfo
        const info = await new Promise((resolve, reject) =>
          api.getUserInfo(targetUserId, (err, res) =>
            err ? reject(err) : resolve(res)
          )
        );

        const thumb =
          info[targetUserId] && info[targetUserId].thumbSrc;

        const r2 = await axios.get(thumb, {
          responseType: "arraybuffer"
        });

        picData = r2.data;
      }

      const avatar = await canvas.loadImage(
        Buffer.from(picData)
      );

      const cv = canvas.createCanvas(
        templateImage.width,
        templateImage.height
      );

      const ctx = cv.getContext("2d");
      ctx.drawImage(templateImage, 0, 0);

      // Scale according to original template size
      const k = templateImage.width / tpl.ref.w;
      const ax = tpl.avatar.x * k;
      const ay =
        tpl.avatar.y * (templateImage.height / tpl.ref.h);
      const as = tpl.avatar.size * k;

      ctx.save();
      ctx.beginPath();
      ctx.arc(
        ax + as / 2,
        ay + as / 2,
        as / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, ax, ay, as, as);
      ctx.restore();

      await fs.writeFile(
        outputPath,
        cv.toBuffer("image/jpeg")
      );

      return api.sendMessage(
        {
          body: "তুই একটা বদল\nমাথায় গোবর-গু ছাড়া কিছু নাই🤣😹",
          attachment: fs.createReadStream(outputPath)
        },
        event.threadID,
        () => {
          fs.unlink(outputPath).catch(() => {});
        },
        event.messageID
      );
    } catch (error) {
      await fs.unlink(outputPath).catch(() => {});
      return api.sendMessage(
        "Error: " + error.message,
        event.threadID,
        event.messageID
      );
    }
  }
};

const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

let lastPlayed = -1;

module.exports = {
  config: {
    name: "gan",
    version: "1.0.2",
    role: 0,
    author: "ARIYAN-SABBIR",
    shortDescription: "Play random song with command 🎶",
    longDescription: "Sends a random mp3 song from preset Catbox links.",
    category: "media",
    guide: "{p}gan"
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;

    // 🔒 AUTHOR LOCK
    const authorHash = crypto
      .createHash("sha256")
      .update(module.exports.config.author || "")
      .digest("hex");

    if (
      authorHash !==
      "e5880e78058583b9890ed12efb49333cc0f1e838d4d5469e0c9e8522edb05e6b"
    ) {
      return api.sendMessage(
        "😼 কিরে! ARIYAN বসের নাম চেঞ্জ করলি কেন? 😼😂 এই ফাইল কি তোর বাপে বানাইছিল নাকি? 😭🤣",
        threadID,
        messageID
      );
    }

    const songLinks = [
      "https://files.catbox.moe/jx9cpq.mp4",
      "https://files.catbox.moe/jzg3j7.mp4",
      "https://files.catbox.moe/m4nggm.mp4",
      "https://files.catbox.moe/dbxfju.mp4",
      "https://files.catbox.moe/xx6d7i.mp4",
      "https://files.catbox.moe/0gncxf.mp4",
      "https://files.catbox.moe/gcm88s.mp4",
      "https://files.catbox.moe/yz23lp.mp4",
      "https://files.catbox.moe/etsdn9.mp3",
      "https://files.catbox.moe/ayepdz.mp3",
      "https://files.catbox.moe/oaecnx.mp3",
      "https://files.catbox.moe/xtpf61.mp3",
      "https://files.catbox.moe/12grz0.mp3",
      "https://files.catbox.moe/aaqddo.mp3",
      "https://files.catbox.moe/k3acvx.mp3",
      "https://files.catbox.moe/nry1qv.mp3",
      "https://files.catbox.moe/23e8u1.mp3",
      "https://files.catbox.moe/y8dzik.mp3",
      "https://files.catbox.moe/z9d2e6.mp3",
      "https://files.catbox.moe/23e8u1.mp3",
      "https://files.catbox.moe/0xscc8.mp3",
      "https://files.catbox.moe/q4m2ad.mp3",
      "https://files.catbox.moe/y8bg4r.mp3",
      "https://files.catbox.moe/q61co1.mp3",
      "https://files.catbox.moe/euq7fo.mp3",
      "https://files.catbox.moe/x5f56o.mp3",
      "https://files.catbox.moe/avlqok.mp3",
      "https://files.catbox.moe/v0twt3.mp3",
      "https://files.catbox.moe/qmpvpt.mp3"
    ];

    if (songLinks.length === 0) {
      return api.sendMessage(
        "❌ Nᴏ sᴏɴɢs ᴄᴏᴜʟᴅ ʙᴇ ғᴏᴜɴᴅ!",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("🎵", messageID, () => {}, true);

    let index;

    do {
      index = Math.floor(Math.random() * songLinks.length);
    } while (index === lastPlayed && songLinks.length > 1);

    lastPlayed = index;

    const url = songLinks[index];
    const filePath = path.join(__dirname, `/cache/song_${index}.mp3`);

    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        api.sendMessage(
          {
            body: "🎶 Hᴇʀᴇ's ʏᴏᴜʀ sᴏɴɢ 🎧\n👑 Powered by ARIYAN-SABBIR",
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          async () => {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error("[GAN CLEANUP ERROR]", err.message);
            }
          },
          messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage(
          "❌ Fᴀɪʟᴇᴅ ᴛᴏ sᴇɴᴅ sᴏɴɢ!",
          threadID,
          messageID
        );
      });

    } catch (err) {
      console.error("[GAN DOWNLOAD ERROR]", err);
      api.sendMessage(
        "⚠️ Fᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ sᴏɴɢ!",
        threadID,
        messageID
      );
    }
  }
};

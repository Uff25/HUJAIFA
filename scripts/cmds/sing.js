const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");
const { downloadVideo } = require("joy-video-downloader");

// 🔐 SAFE WRAPPER (prevents clearLine / stderr crash issues)
function safeRun(fn) {
  try {
    return fn();
  } catch (e) {
    return null;
  }
}

module.exports = {
  config: {
    name: "song",
    version: "9.2.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    description: "Stable YouTube music downloader",
    prefix: true,
    category: "media",
    usages: "song <name/link>",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args.length) {
      return api.sendMessage(
        "⚠️ গান নাম বা YouTube link দিন",
        threadID,
        messageID
      );
    }

    let query = args.join(" ");
    let ytLink = query;

    try {
      // 🔍 YouTube search
      if (!ytLink.includes("youtu")) {
        const search = await yts(query);

        if (!search?.videos?.length) {
          return api.sendMessage(
            "❌ গান পাওয়া যায়নি",
            threadID,
            messageID
          );
        }

        ytLink = search.videos[0].url;
      }

      
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const loading = await api.sendMessage(
        "🎧 Downloading...",
        threadID
      );

      
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(
        cacheDir,
        `song_${Date.now()}.mp3`
      );

      // 🎵 download (safe execution)
      const data = await downloadVideo(ytLink, filePath);

      if (!data || !data.filePath) {
        api.unsendMessage(loading.messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);

        return api.sendMessage(
          "❌ গান ডাউনলোড ব্যর্থ হয়েছে",
          threadID,
          messageID
        );
      }

      const title = data.title || "Unknown Song";
      const savedPath = data.filePath;

      api.unsendMessage(loading.messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);

      // 🎧 send song
      return api.sendMessage(
        {
          body:
`🎵 SONG DOWNLOADED

📌 Title: ${title}
🔗 Link: ${ytLink}
👑 𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`,

          attachment: fs.createReadStream(savedPath)
        },
        threadID,
        () => {
          safeRun(() => {
            if (fs.existsSync(savedPath)) fs.unlinkSync(savedPath);
          });
        },
        messageID
      );

    } catch (err) {
      console.log("Song Error:", err);

      api.setMessageReaction("❌", messageID, () => {}, true);

      return api.sendMessage(
        "❌সমস্যা হয়েছে 🚨বস সিয়াম এর ইনবক্সে নক দাও🌚 https://www.facebook.com/profile.php?id=100037154624637",
        threadID,
        messageID
      );
    }
  },

  run: async function (data) {
    return module.exports.onStart(data);
  }
};

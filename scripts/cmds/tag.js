module.exports = {
  config: {
    name: "tag",
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "GROUP",
    shortDescription: "Random message",
    longDescription: "Type tag and get random message",
    guide: "Just type: tag"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const body = event.body?.toLowerCase();

      // শুধু tag লিখলে কাজ করবে
      if (body !== "tag") return;

      // শুধু এই ছোট ছোট রিপ্লাইগুলা আসবে
      const messages = [
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🤬 সবাই গ্রুপে আসো 🌸",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 💋 চিপা থেকে বাহির হও 😹",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 😑 সবার চিপায় ঠান্ডা পড়ুক 🥶",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 😴 কে কে অনলাইনে আছো 👀",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 😩 সবাই একটু রেসপন্স দাও 💌",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🥵 এত শান্ত কেন গ্রুপটা 😴",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🎭 সবাই কোথায় গেলা 😹",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🌸 গ্রুপটা জমাও সবাই ✨",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 💥 সবাই একবার হাজিরা দাও 😼",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🌀 ভূতের মতো সিন মেরে থাকো না 👻",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone ☄️ সবাই দ্রুত চলে আসো 🚀",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🥀 গ্রুপে একটু আওয়াজ দাও 🔊",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🎀 সবাই চ্যাটে নেমে পড়ো 😽",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🌟 লুকিয়ে থেকো না বের হও 😹",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🍁 সবাইকে ডাক দিচ্ছি চলে আসো 💫",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 💎 এত ভাব কিসের রে 😒",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🕊️ সবাই অ্যাক্টিভ হও 🌸",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🔥 আজকে গ্রুপে আগুন লাগাও 😈",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone 🌺 সবাই রিপ্লাই দাও না হলে জরিমানা 😹",
        "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑 @everyone ⚔️ ঘুম ভেঙে থাকলে সাড়া দাও 😴 "
      ];

      // Random message
      const randomMsg =
        messages[Math.floor(Math.random() * messages.length)];

      api.sendMessage(
        randomMsg,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      api.sendMessage(
        "❌ Error: " + err.message,
        event.threadID,
        event.messageID
      );
    }
  }
};

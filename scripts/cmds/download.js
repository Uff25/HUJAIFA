const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "download",
    version: "1.4",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", // LOCKED AUTHOR
    countDown: 5,
    role: 0,
    shortDescription: "Download media from direct link",
    category: "media",
    guide: "{pn} <direct-link>"
  },

  onStart: async function ({ api, event, args }) {

    
    const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

    if (module.exports.config.author !== LOCKED_AUTHOR) {
      const lockMsg = 
`» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑
───────────────
» ⛔ 𝗙𝗜𝗟𝗘 𝗟𝗢𝗖𝗞𝗘𝗗
» ❌ আ্ঁরি্ঁয়া্ঁন্ঁ ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        lockMsg,
        event.threadID,
        event.messageID
      );
    }
    //𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍

    const url = args[0];

    if (!url) {
      const usageMsg = 
`» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑
───────────────
» ⚠️ অনুগ্রহ করে একটি 
» ❌ 𝗗𝗶𝗿𝗲𝗰𝘁 𝗟𝗶𝗻𝗸 দিন।
───────────────
 💡 ব্যবহার পদ্ধতি:
 🎀 download https://example.com/video.mp4
───────────────
» 🧚‍♀️‿𝐀𝐑𝐈𝐘𝐀𝐍  𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        usageMsg,
        event.threadID,
        event.messageID
      );
    }

    const supported = [
      ".mp4", ".mp3",
      ".jpg", ".jpeg", ".png", ".gif",
      ".pdf", ".docx", ".txt", ".zip"
    ];

    const cleanUrl = url.split("?")[0];
    const ext = path.extname(cleanUrl).toLowerCase();

    if (!supported.includes(ext)) {
      const unsupportedMsg = 
`» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑
───────────────
» ❌ 𝗨𝗻𝘀𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝗙𝗶𝗹𝗲 𝗧𝘆𝗽𝗲!
───────────────
» 📜 সাপোর্ট ফাইল ফরম্যাট:
» 📁 mp4 mp3 jpg png gif 
» ✅ pdf docx txt zip
───────────────
» 🧚‍♀️ ‿𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        unsupportedMsg,
        event.threadID,
        event.messageID
      );
    }

    const fileName = `download${ext}`;

    try {
      const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴...
» 🚀 অনুগ্রহ করে কিছুক্ষণ 
» 👑 অপেক্ষা করুন...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const loadingMsg = await api.sendMessage(
        loadingText,
        event.threadID
      );

      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      fs.writeFileSync(fileName, res.data);

      api.unsendMessage(loadingMsg.messageID);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲!
» 📁 ফাইল: ${fileName}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          body: successMsg,
          attachment: fs.createReadStream(fileName)
        },
        event.threadID,
        () => fs.unlinkSync(fileName)
      );

    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ডাউনলোড ব্যর্থ হয়েছে!
» 💥 লিংকটি ভুল বা 𝗗𝗶𝗿𝗲𝗰𝘁 
» 📉 𝗟𝗶𝗻𝗸 নাও হতে পারে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        errorMsg,
        event.threadID
      );
    }
  }
};

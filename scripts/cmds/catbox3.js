const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");
const path = require("path");

async function getUploadApiUrl() {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/Ayan-alt-deep/xyc/main/baseApiurl.json");
    return res.data.catbox || "https://catbox.moe/user/api.php";
  } catch {
    return "https://catbox.moe/user/api.php";
  }
}

async function handleCatboxUpload({ event, api, message }) {
  const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

  if (module.exports.config.author !== LOCKED_AUTHOR) {
    const lockMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ 𝗙𝗜𝗟𝗘 𝗟𝗢𝗖𝗞𝗘𝗗
» ❌ সিয়াম ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return message.reply(lockMsg);
  }

  const { messageReply, messageID } = event;
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    const noMediaMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📁 যেকোনো ছবি অথবা 
» 🎬 ভিডিওতে রিপ্লাই দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return message.reply(noMediaMsg);
  }

  const fileUrl = messageReply.attachments[0].url;
  const ext = messageReply.attachments[0].type === "photo" ? ".jpg" : ".mp4";
  const filePath = path.join(__dirname, "temp" + ext);

  api.setMessageReaction("🕛", messageID, () => {}, true);

  const waitMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚀 ফাইল ক্যাটবক্সে পাঠানোর কাজ
» 🌌 দ্রুত গতিতে চলছে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

  const loading = await message.reply(waitMsg);

  setTimeout(() => {
    if (loading?.messageID) {
      api.unsendMessage(loading.messageID);
    }
  }, 5000);

  try {
    const uploadApiUrl = await getUploadApiUrl();

    const response = await axios.get(fileUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(filePath));

    const upload = await axios.post(uploadApiUrl, form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(filePath);

    api.setMessageReaction("✅", messageID, () => {}, true);

    const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💎 মিডিয়া আপলোড সম্পন্ন!
» ✨ লিঙ্ক: ${upload.data}`;

    return message.reply(successMsg);
  } catch (err) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    api.setMessageReaction("❌", messageID, () => {}, true);

    const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚨 আপলোড ব্যর্থ হয়েছে!
» 📡 পুনরায় চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return message.reply(errorMsg);
  }
}

module.exports = {
  config: {
    name: "catbox3",
    aliases: ["ct3"],
    version: "1.3",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Upload media to catbox.moe"
    },
    longDescription: {
      en: "Upload replied image or video to catbox.moe and get link"
    },
    category: "tools",
    guide: {
      en: "{pn} (reply to image/video)"
    }
  },

  onStart: async function ({ event, api, message }) {
    return handleCatboxUpload({ event, api, message });
  }
};

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Photo360 = require("abir-photo360-apis");

const templates = {
  "1": "Foggy glass text",
  "2": "Cloud text",
  "3": "Light glow",
  "4": "Glitch text",
  "5": "3D metal",
  "6": "Foggy rainy",
  "7": "Sand writing",
  "8": "Diamond text",
  "9": "Neon signature",
  "10": "Broken glass",
  "11": "Multicolor arrow",
  "12": "Graffiti wall",
  "13": "Watercolor",
  "14": "Night lend",
  "15": "Sky clouds",
  "16": "Beach sand",
  "17": "Dark green",
  "18": "Stars night",
  "19": "3D sand",
  "20": "Summery sand",
  "21": "Firework text",
  "22": "Leaves ligature",
  "23": "Letters on leaves",
  "24": "Graffiti color",
  "25": "Paper cut"
};

const urls = {
  "1": "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
  "2": "https://en.ephoto360.com/create-realistic-cloud-text-effect-606.html",
  "3": "https://en.ephoto360.com/light-glow-text-effect-369.html",
  "4": "https://en.ephoto360.com/glitch-text-effect-online-345.html",
  "5": "https://en.ephoto360.com/3d-metal-text-effect-600.html",
  "6": "https://en.ephoto360.com/foggy-rainy-text-effect-75.html",
  "7": "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html",
  "8": "https://en.ephoto360.com/diamond-text-95.html",
  "9": "https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html",
  "10": "https://en.ephoto360.com/create-broken-glass-text-effect-online-698.html",
  "11": "https://en.ephoto360.com/create-multicolored-signature-attachment-arrow-effect-714.html",
  "12": "https://en.ephoto360.com/create-a-graffiti-text-effect-on-the-wall-online-665.html",
  "13": "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html",
  "14": "https://en.ephoto360.com/creating-text-effects-night-lend-for-word-effect-147.htm",
  "15": "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",
  "16": "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html",
  "17": "https://en.ephoto360.com/dark-green-typography-online-359.html",
  "18": "https://en.ephoto360.com/stars-night-online-1-85.html",
  "19": "https://en.ephoto360.com/realistic-3d-sand-text-effect-online-580.html",
  "20": "https://en.ephoto360.com/create-a-summery-sand-writing-text-effect-577.html",
  "21": "https://en.ephoto360.com/text-firework-effect-356.html",
  "22": "https://en.ephoto360.com/ligatures-effects-from-leaves-146.html",
  "23": "https://en.ephoto360.com/write-letters-on-the-leaves-248.html",
  "24": "https://en.ephoto360.com/graffiti-color-199.html",
  "25": "https://en.ephoto360.com/caper-cut-effect-184.html"
};

async function makePhoto({ api, event, templateID, text, commandName }) {
  const { threadID, messageID, senderID } = event;

  if (!urls[templateID]) {
    const invalidMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল 𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲 𝗜𝗗 দিয়েছেন!
» 🎀 সঠিক তালিকা দেখতে লিখুন:
» 📖 .ephoto list
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
    return api.sendMessage(invalidMsg, threadID, messageID);
  }

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  const imagePath = path.join(cacheDir, `ephoto_${Date.now()}.png`);

  try {
    const photo = new Photo360(urls[templateID]);
    photo.setName(text);

    const result = await photo.execute();

    const res = await axios.get(result.imageUrl, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    await fs.writeFile(imagePath, res.data);

    const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 আপনার ফটো 
» ☑️ সফলভাবে তৈরি হয়েছে!
» 🆔 𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲 𝗜𝗗: 
» 🆔 #${templateID}
» ✍️ 𝗧𝗲𝘴𝘁: ${text}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return api.sendMessage({
      body: successMsg,
      attachment: fs.createReadStream(imagePath)
    }, threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: commandName,
          messageID: info.messageID,
          author: senderID
        });
      }
      setTimeout(() => {
        fs.remove(imagePath).catch(() => {});
      }, 15000);
    }, messageID);

  } catch (err) {
    console.error("Ephoto Error:", err);
    const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥 দুঃখিত! ফটো তৈরি 
» ❌ করতে সমস্যা হয়েছে।
» 🔄 অনুগ্রহ করে কিছুক্ষণ 
» 🫠 পর আবার চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
    return api.sendMessage(errorMsg, threadID, messageID);
  }
}

module.exports = {
  config: {
    name: "ephoto",
    aliases: ["3d"],
    version: "1.3.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    countDown: 5,
    category: "textmaker",
    shortDescription: {
      en: "Generate stylish images with Ephoto360"
    },
    longDescription: {
      en: "Create stylish images from text using Ephoto360 templates"
    },
    guide: {
      en: "{pn} <templateID> <text>\n\nExample:\n{pn} 1 Farhan\n\nUse: {pn} list"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Show list
    if (args[0] && args[0].toLowerCase() === "list") {
      let listTxt = "";
      for (const id in templates) {
        listTxt += `» 🎨 ${id}. ${templates[id]}\n`;
      }
      const listMessage = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📜 𝗧𝗘𝗠𝗣𝗟𝗔𝗧𝗘 𝗟𝗜𝗦𝗧
» 🎰 সব টেমপ্লেটের তালিকা 
» 🙂 নিচে দেওয়া হলো:
───────────────
${listTxt}───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(listMessage, threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    }

    if (args.length < 2) {
      const usageMessage = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ অনুগ্রহ করে 𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲 𝗜𝗗
» 📝 এবং আপনার 𝗧𝗲𝘴𝘁 দিন।
───────────────
» 💡 ব্যবহার পদ্ধতি:
» 🙄 .ephoto 1 Siyam
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(usageMessage, threadID, messageID);
    }

    const templateID = args[0];
    const text = args.slice(1).join(" ");

    return makePhoto({ api, event, templateID, text, commandName: this.config.name });
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) {
      const wrongUserMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ আপনি এই মেসেজে 
» 🚫 Reply করতে পারবেন না!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(wrongUserMsg, threadID, messageID);
    }

    const args = body.trim().split(" ");
    if (args.length < 2) {
      const invalidMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ আপনার নাম লিখুন!
» 📝 যেমন: 1 Siyam
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(invalidMsg, threadID, messageID);
    }

    const templateID = args[0];
    const text = args.slice(1).join(" ");

    return makePhoto({ api, event, templateID, text, commandName: this.config.name });
  }
};

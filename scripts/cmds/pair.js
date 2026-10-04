const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    aliases: ["match", "couple"],
    version: "2.5",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    category: "love",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Find a love match in the group" },
    guide: { en: "{pn} | reply | mention" }
  },

  onStart: async function ({ api, event, usersData }) {
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);
    const outputPath = path.join(cacheDir, `pair_${event.senderID}_${Date.now()}.png`);

    try {
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData ? senderData.name : "Unknown";

      let targetID = null;

      // ১. যদি মেসেজে রিপ্লাই দেওয়া হয়
      if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } 
      // ২. যদি কাউকেই মেনশন করা হয়
      else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }

      let matchID = null;
      let matchName = "";

      // যদি মেনশন বা রিপ্লাই থাকে
      if (targetID) {
        if (targetID === event.senderID) {
          return api.sendMessage(
            "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» ❌ নিজেকে নিজে পেয়ার করতে পারবেন না!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
            event.threadID,
            event.messageID
          );
        }
        matchID = targetID;
        const targetData = await usersData.get(targetID);
        matchName = targetData ? targetData.name : "Unknown User";
      } 
      // ৩. যদি মেনশন বা রিপ্লাই না থাকে (র‍্যান্ডম সিলেক্ট)
      else {
        const threadData = await api.getThreadInfo(event.threadID);
        const users = threadData.userInfo || [];

        const myData = users.find((user) => user.id === event.senderID);
        if (!myData || !myData.gender) {
          return api.sendMessage(
            "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» ❌ আপনার জেন্ডার নির্ধারণ করা যায়নি!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
            event.threadID,
            event.messageID
          );
        }

        const myGender = myData.gender.toUpperCase();
        let matchCandidates = [];

        if (myGender === "MALE") {
          matchCandidates = users.filter(user => user.gender === "FEMALE" && user.id !== event.senderID);
        } else if (myGender === "FEMALE") {
          matchCandidates = users.filter(user => user.gender === "MALE" && user.id !== event.senderID);
        } else {
          return api.sendMessage(
            "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» ❌ আপনার জেন্ডার ডিফাইন করা নেই!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
            event.threadID,
            event.messageID
          );
        }

        if (matchCandidates.length === 0) {
          return api.sendMessage(
            "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗡𝗢 𝗠𝗔𝗧𝗖𝗛\n» ❌ গ্রুপে বিপরীত লিঙ্গের কোনো মেম্বার পাওয়া যায়নি!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
            event.threadID,
            event.messageID
          );
        }

        const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
        matchID = selectedMatch.id;
        matchName = selectedMatch.name;
      }

      const width = 800;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background image
      const background = await loadImage("https://i.postimg.cc/pdv5dFVX/611905695-855684437229208-8377464727643815456-n.png");
      ctx.drawImage(background, 0, 0, width, height);

      // Profile pictures
      const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
      const sIdImage = await loadImage(
        `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=${token}`
      );
      const pairPersonImage = await loadImage(
        `https://graph.facebook.com/${matchID}/picture?width=720&height=720&access_token=${token}`
      );

      // Draw circular avatars
      function drawCircle(ctx, img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      drawCircle(ctx, sIdImage, 385, 40, 170);
      drawCircle(ctx, pairPersonImage, width - 213, 190, 170);

      // Write canvas to file
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(outputPath, imageBuffer);

      const lovePercent = Math.floor(Math.random() * 31) + 70;

      const messageText = 
        `» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n` +
        `» 💗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟 𝗣𝗔𝗜𝗥𝗜𝗡𝗚\n` +
        `» 👤 ${senderName}\n` +
        `» 👤 ${matchName}\n` +
        `» 💌 আপনাদের দুজনের শত বছরের সুখী জীবন কামনা করি!\n` +
        `» 💙 ভালোবাসার শতকরা হার: ${lovePercent}%\n───────────────\n` +
        `» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(
        {
          body: messageText,
          attachment: fs.createReadStream(outputPath)
        },
        event.threadID,
        () => fs.removeSync(outputPath),
        event.messageID
      );

    } catch (error) {
      console.error("Pair Command Error:", error);
      if (fs.existsSync(outputPath)) fs.removeSync(outputPath);

      api.sendMessage(
        `» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ জোড়া তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }
  }
};

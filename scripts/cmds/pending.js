const getRandomImage = async () => {
  try {
    const res = await global.utils.getStreamFromURL("https://i.imgur.com/3fBvpps.jpeg");
    return res;
  } catch (err) {
    return null;
  }
};

module.exports = {
  config: {
    name: "pending",
    aliases: ["pen", "pend", "pe"],
    version: "2.0.6",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    shortDescription: "Handle pending requests",
    longDescription: "Approve or reject pending user or group requests",
    category: "utility",
    guide: {
      en: "{pn} [user/thread/all]\nReply with group number(s) to approve\nType 'c' to cancel"
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, pending, messageID } = Reply;
    if (String(event.senderID) !== String(author)) return;

    const { body, threadID } = event;

    if (body.trim().toLowerCase() === "c") {
      try {
        await api.unsendMessage(messageID);
        return api.sendMessage(
          "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗖𝗔𝗡𝗖𝗘𝗟𝗟𝗘𝗗\n» ❌ অপারেশনটি বাতিল করা হয়েছে!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          threadID
        );
      } catch {
        return;
      }
    }

    const rawIndexes = body
      .split(/\s+/)
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= pending.length);

    const indexes = [...new Set(rawIndexes)];

    if (indexes.length === 0) {
      return api.sendMessage(
        "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗\n» ❌ সঠিক সংখ্যা নির্বাচন করুন!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }

    let count = 0;
    const sortedIndexes = [...indexes].sort((a, b) => a - b);

    for (const idx of sortedIndexes) {
      const item = pending[idx - 1];

      try {
        const prefix = global.GoatBot?.config?.prefix || "/";
        const msgPayload = {
          body: `「 𝐆𝐫𝐨𝐮𝐩 𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝 」\n[🤖] 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱: {${prefix}}\n______________[🤖]______________\n\n⎯͢⎯⃝🩷🐰 *গা্ঁই্ঁস্ঁ* *মু্ঁই্ঁ* *পি্ঁচ্ছি্ঁ* *আ্ঁরি্ঁয়া্ঁন্ঁ* *এ্ঁরৃঁ* *বৃঁটৃঁ* *আ্ঁই্ঁয়া্ঁ* *পৃঁরৃঁছি্ঁ* *মো্ঁরে্ঁ* *কি্ঁ* *দে্ঁহা্ঁ* *যা্ঁয়্ঁ* ⎯͢⎯⃝🩷🐰\n______________[🤖]______________`
        };

        await api.sendMessage(msgPayload, item.threadID);

        if (item.isGroup) {
          const botNickname = global.GoatBot?.config?.nickNameBot || "[ , ] 𝘽𝙤𝙩 - সু্ঁই্ঁটি্ঁ বে্ঁবি্ঁ🌊🪶";
          try {
            await api.changeNickname(
              botNickname,
              item.threadID,
              api.getCurrentUserID()
            );
          } catch (e) {}
        }

        count++;
      } catch (err) {
        console.error(`Failed to approve thread ${item.threadID}:`, err.message);
      }
    }

    try { await api.unsendMessage(messageID); } catch (e) {}
    return api.sendMessage(
      `» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n» 🎉 সফলভাবে ${count} টি গ্রুপ/ইউজার এপ্রুভ করা হয়েছে!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID
    );
  },

  onStart: async function ({ api, event, args, usersData, commandName }) {
    const { threadID, messageID, senderID } = event;

    const type = args[0]?.toLowerCase();
    if (!type || !["user", "thread", "all"].includes(type)) {
      return api.sendMessage(
        "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 📌 ব্যবহারবিধি: pending [user/thread/all]\n───────────────\n» 🧚‍♀️️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }

    try {
      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const list = [...spam, ...pending];
      let filteredList = [];

      if (type.startsWith("u")) filteredList = list.filter(t => !t.isGroup);
      else if (type.startsWith("t")) filteredList = list.filter(t => t.isGroup);
      else if (type === "all") filteredList = list;

      if (filteredList.length === 0) {
        return api.sendMessage(
          "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» 📑 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 𝗟𝗜𝗦𝗧\n» ✅ কোনো পেন্ডিং রিকোয়েস্ট পাওয়া যায়নি!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          threadID
        );
      }

      let msg = "";
      let index = 1;

      for (const single of filteredList) {
        let name = "Unknown";
        if (single.isGroup) {
          name = single.name || "Group Chat";
        } else {
          const userData = await usersData.get(single.threadID);
          name = userData ? userData.name : "Facebook User";
        }
        msg += `» [ ${index} ] ${name} (${single.threadID})\n`;
        index++;
      }

      const finalMessage = `» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» 📑 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ${type.toUpperCase()} 𝗟𝗜𝗦𝗧\n\n${msg}\n───────────────\n» 📌 এপ্রুভ করতে নম্বর লিখে রিপ্লাই দিন!\n» ❌ বাতিল করতে "c" লিখে রিপ্লাই দিন।\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const sendPayload = { body: finalMessage };

      return api.sendMessage(
        sendPayload,
        threadID,
        (error, info) => {
          if (error) return console.error(error);

          global.GoatBot.onReply.set(info.messageID, {
            commandName: commandName,
            messageID: info.messageID,
            author: senderID,
            pending: filteredList
          });
        },
        messageID
      );
    } catch (error) {
      console.error("Pending fetch error:", error);
      return api.sendMessage(
        "» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ পেন্ডিং লিস্ট আনতে সমস্যা হয়েছে!\n───────────────\n» 🧚‍♀️𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        threadID
      );
    }
  }
};

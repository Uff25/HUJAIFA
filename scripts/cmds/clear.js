module.exports = {
  config: {
    name: "clear",
    aliases: ["sall", "unsendall"],
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    version: "3.6",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: "Safely unsends recent bot messages in batches"
    },
    longDescription: {
      en: "Unsends up to 20 bot messages per command safely."
    },
    category: "owner",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    try {
      const history = await api.getThreadHistory(threadID, 50);

      if (!history || !Array.isArray(history)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐡𝐢𝐬𝐭𝐨𝐫𝐲 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID
        );
      }

      const currentUserID = api.getCurrentUserID();

      const botMessages = history.filter(
        (message) => message.senderID === currentUserID
      );

      if (botMessages.length === 0) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ℹ️ ডিলিট করার মতো 
» 🤯 কোনো মেসেজ নেই!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID
        );
      }

      const waitMsg = await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭
» 👏 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬 𝐚𝐫𝐞 𝐝𝐞𝐥𝐞𝐭𝐢𝐧𝐠...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID
      );

      const targetMessages = botMessages.slice(0, 20);
      let successCount = 0;

      for (const message of targetMessages) {
        try {
          await api.unsendMessage(message.messageID);
          successCount++;
          await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (err) {

        }
      }

      if (waitMsg && waitMsg.messageID) {
        try {
          await api.unsendMessage(waitMsg.messageID);
        } catch (e) {}
      }

      if (successCount > 0) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ সফলভাবে মেসেজ 
» 😘 ডিলিট করা হয়েছে!
» 💡 আরও মেসেজ ডিলিট 
» 😉 করতে চাইলে 
» 🤪 আবার কমান্ড দিন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID
        );
      } else {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ কোনো মেসেজ 
» 🥲 ডিলিট করা সম্ভব হয়নি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID
        );
      }
    } catch (err) {
      console.error("Clear command error:", err);
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কমান্ডটি রান কতে 
» 😀 সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID
      );
    }
  }
};

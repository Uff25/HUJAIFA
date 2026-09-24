module.exports = {
  config: {
    name: "gcnen",
    aliases: ["groupban", "banlist", "gcben", "bannedgrouplist"],
    version: "1.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 2,
    countDown: 5,
    category: "owner",
    shortDescription: {
      en: "Ban or unban groups and view banned groups"
    },
    guide: {
      en: "{pn} or {p}gcben"
    }
  },

  onStart: async function ({ api, event, threadsData, args }) {
    const { threadID, messageID, senderID, body } = event;

    try {
      const allThreads = await threadsData.getAll();
      let groupList = allThreads.filter(t => t.isGroup !== false);

      const isOnlyBannedCommand = event.body && (event.body.toLowerCase().includes("gcben") || event.body.toLowerCase().includes("bannedgrouplist"));

      if (isOnlyBannedCommand) {
        groupList = groupList.filter(t => t.data && t.data.banned === true);
      }

      if (groupList.length === 0) {
        const noDataMsg = isOnlyBannedCommand 
          ? "» ❌ কোনো ব্যান থাকা গ্রুপের তথ্য পাওয়া যায়নি!" 
          : "» ❌ কোনো গ্রুপের তথ্য পাওয়া যায়নি!";

        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
${noDataMsg}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID,
          messageID
        );
      }

      let txt = "";
      const threadMap = [];

      for (let i = 0; i < groupList.length; i++) {
        const thread = groupList[i];
        const isBanned = thread.data && thread.data.banned === true;
        const status = isBanned ? "❌ 𝐁𝐚𝐧𝐧𝐞𝐝" : "✅ 𝐀𝐜𝐭𝐢𝐯𝐞";

        txt += `» ${i + 1}. ${thread.threadName || "Unknown Group"}\n» 🆔: ${thread.threadID}\n» 📌 𝐒𝐭𝐚𝐭𝐮𝐬: ${status}\n───────────────\n`;
        threadMap.push({
          threadID: thread.threadID,
          threadName: thread.threadName || "Unknown Group",
          isBanned: isBanned
        });
      }

      const titleHeader = isOnlyBannedCommand ? "📜 𝗕𝗔𝗡𝗡𝗘𝗗 𝗚𝗥𝗢𝗨𝗣 𝗟𝗜𝗦𝗧" : "📜 𝗚𝗥𝗢𝗨𝗣 𝗟𝗜𝗦𝗧";

      const listMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ${titleHeader}
───────────────
${txt}» 💡 গ্রুপের নম্বর লিখে 𝗥𝗲𝗽𝗹𝘆 দিন 
» 🚫 ব্যান/আনব্যান করার জন্য।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(listMsg, threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            threadMap: threadMap
          });
        }
      }, messageID);

    } catch (err) {
      console.error("GCNEN Error:", err);
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥 গ্রুপের তালিকা তৈরি 
» 🧟 করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply, threadsData }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) {
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ আপনি এই লিস্টে 
» 🌚 𝗥𝗲𝗽𝗹𝘆 করতে পারবেন না!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }

    const index = parseInt(body.trim()) - 1;
    const threadMap = Reply.threadMap;

    if (isNaN(index) || !threadMap[index]) {
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ সঠিক সংখ্যা নির্বাচন করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }

    const targetThread = threadMap[index];
    const newBanStatus = !targetThread.isBanned;

    try {
      await threadsData.set(targetThread.threadID, {
        "data.banned": newBanStatus
      });

      const actionText = newBanStatus ? "ব্যান করা হয়েছে 🔴" : "আনব্যান করা হয়েছে 🟢";

      if (!newBanStatus) {
        const unbanNotice = 
`━━━━━━━━━━━━━━━
🌸 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 🌸
━━━━━━━━━━━━━━━
👥 𝐆𝐫𝐨𝐮𝐩 : ${targetThread.threadName}

✅ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐍𝐁𝐀𝐍𝐍𝐄𝐃
🎉 এই গ্রুপটি বট থেকে আনব্যান করা হয়েছে।
⚡ এখন থেকে গ্রুপের সকল মেম্বার বট এবং 
🔰 কমান্ড ব্যবহার করতে পারবেন।

📱 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: +8801789138157
📘 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: wwww/68
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━`;

        api.sendMessage(unbanNotice, targetThread.threadID);

        if (global.notifiedUsersInBannedGroup) {
          for (const key of global.notifiedUsersInBannedGroup) {
            if (key.startsWith(`${targetThread.threadID}_`)) {
              global.notifiedUsersInBannedGroup.delete(key);
            }
          }
        }
      }

      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝗚𝗥𝗢𝗨𝗣 𝗦𝗧𝗔𝗧𝗨𝗦 𝗨𝗣𝗗𝗔𝗧𝗘𝗗
» 🏷️ 𝐆𝐑𝐎𝐔𝐏: ${targetThread.threadName}
» 🆔 𝐈𝐃: ${targetThread.threadID}
» 📌 𝐒𝐓𝐀𝐓𝐔𝐒: ${actionText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );

    } catch (err) {
      console.error("GCNEN Reply Error:", err);
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥 স্ট্যাটাস পরিবর্তন 
» 😃 করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }
  }
};

module.exports = {
    config: {
        name: "gcban",
        version: "4.0",
        author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        countDown: 5,
        role: 2,
        description: {
            bn: "গ্রুপ ব্যান এবং আনব্যান সিস্টেম পরিচালনা করুন",
            en: "Manage group ban and unban system"
        },
        guide: {
            bn: "{pn}\n{pn} list",
            en: "{pn}\n{pn} list"
        },
        category: "owner"
    },

    onStart: async function ({ args, threadsData, message, event, role, api }) {
        if (role < 2) {
            return message.reply("❌ অনলি মাই বস 𝐒𝐈𝐘𝐀𝐌 🧘🫣");
        }

        const type = (args[0] || "").toLowerCase();

        if (type === "list" || type === "-l") {
            const allThreads = await threadsData.getAll();
            const bannedThreads = allThreads.filter(
                item => item.data && item.data.banned && item.data.banned.status === true
            );

            if (bannedThreads.length === 0) {
                const noBanMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐆𝐂-𝐁𝐀𝐍-𝟎𝟎
━━━━━━━━━━━━━━━
» ❌ বর্তমানে কোনো 
» 😭 ব্যান গ্রুপ নেই!
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;
                return message.reply(noBanMsg);
            }

            let listText = "";
            bannedThreads.forEach((thread, index) => {
                listText += `\n[ ${index + 1} ] 👥 𝐆𝐫𝐨𝐮𝐩: ${thread.threadInfo?.threadName || "Unknown Group"}\n     🆔 𝐓𝐈𝐃: ${thread.threadID}\n     📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${thread.data.banned.reason || "No reason"}\n`;
            });

            const form = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐓𝐨𝐭𝐚𝐥 𝐁𝐚𝐧𝐧𝐞𝐝 𝐆𝐂: ${bannedThreads.length}
🆔 𝐆𝐂-𝐁𝐀𝐍-𝐋𝐈𝐒𝐓
━━━━━━━━━━━━━━━
${listText}
━━━━━━━━━━━━━━━
» 🔰 যে গ্রুপ আনব্যান করতে
» 🌝 চান সেই নাম্বারটি 
» ✅ (যেমন: 1 বা 1 2)
» 🙄 এই মেসেজে রিপ্লাই দিন।
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

            return message.reply(form, (err, info) => {
                if (err) return;
                if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "unban",
                    bannedThreads
                });
            });
        }

        try {
            const threadList = await api.getThreadList(100, null, ["INBOX"]);
            const activeGroupThreads = threadList.filter(t => t.isGroup && t.isSubscribed);

            if (!activeGroupThreads || activeGroupThreads.length === 0) {
                return message.reply("❌ বট বর্তমানে কোনো গ্রুপে যুক্ত নেই!");
            }

            let gcListText = "";
            activeGroupThreads.forEach((thread, index) => {
                gcListText += `\n[ ${index + 1} ] 👥 𝐍𝐚𝐦𝐞: ${thread.name || "Unknown Group"}\n     🆔 𝐓𝐈𝐃: ${thread.threadID}\n`;
            });

            const mainListForm = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐓𝐨𝐭𝐚𝐥 𝐀𝐜𝐭𝐢𝐯𝐞 𝐆𝐂: ${activeGroupThreads.length}
🆔 𝐀𝐋𝐋-𝐆𝐑𝐎𝐔𝐏-𝐋𝐈𝐒𝐓
━━━━━━━━━━━━━━━
${gcListText}
━━━━━━━━━━━━━━━
» 🚫 যে গ্রুপ ব্যান করতে চান:
» 🔢 নাম্বার লিখে রিপ্লাই দিন।
» 💡 যেমন: "1" অথবা 
» 😀 1 ban" অথবা "1 2 ban"
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

            return message.reply(mainListForm, (err, info) => {
                if (err) return;
                if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "ban",
                    activeThreads: activeGroupThreads
                });
            });
        } catch (error) {
            return message.reply("❌ গ্রুপ লিস্ট আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
    },

    onReply: async function ({ event, api, handleReply, Reply, onReply, threadsData, message }) {
        const replyData = handleReply || Reply || onReply;
        if (!replyData) return;

        if (event.senderID !== replyData.author) return;

        const bodyText = (event.body || "").trim();
        const inputNumbers = bodyText.replace(/ban/gi, "").trim().split(/\s+/);

        if (replyData.type === "ban") {
            const activeThreads = replyData.activeThreads || [];
            let bannedGroupNames = [];

            for (const numStr of inputNumbers) {
                const cleanNumber = numStr.replace(/[^\d]/g, "");
                const index = parseInt(cleanNumber) - 1;

                if (!isNaN(index) && activeThreads[index]) {
                    const targetThread = activeThreads[index];
                    const targetTID = targetThread.threadID;
                    const groupName = targetThread.name || "This Group";

                    const currentThreadData = await threadsData.get(targetTID) || {};
                    const currentData = currentThreadData.data || {};
                    currentData.banned = {
                        status: true,
                        reason: "Banned by Admin/Owner"
                    };

                    await threadsData.set(targetTID, { data: currentData });

                    bannedGroupNames.push(groupName);

                    const banNoticeMsg = `🌸 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 🌸
━━━━━━━━━━━━━━━
👥 𝐆𝐫𝐨𝐮𝐩 : ${groupName}

🚫 𝐆𝐑𝐎𝐔𝐏 𝐁𝐀𝐍𝐍𝐄𝐃
❌ এই গ্রুপটি বট থেকে ব্যান করা হয়েছে।
⚠️ সাধারণ ইউজারদের জন্য বটের কাজ বন্ধ থাকবে।
📩 বিস্তারিত জানতে এডমিনের সাথে যোগাযোগ করুন।

📱 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: +8801789138157
📘 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: 
https://www.facebook.com/profile.php?id=61591371186179
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;

                    api.sendMessage(banNoticeMsg, targetTID).catch(() => {});
                }
            }

            if (bannedGroupNames.length > 0) {
                message.reply(`✅ সফলভাবে নিচের ${bannedGroupNames.length}টি গ্রুপ ব্যান করা হয়েছে:\n\n${bannedGroupNames.map(n => `» 👥 ${n}`).join("\n")}`);
            } else {
                message.reply("❌ সঠিক ইনপুট নম্বর দেননি।");
            }
        }

        if (replyData.type === "unban") {
            const bannedThreads = replyData.bannedThreads || [];
            let unbannedGroupNames = [];

            for (const numStr of inputNumbers) {
                const cleanNumber = numStr.replace(/[^\d]/g, "");
                const index = parseInt(cleanNumber) - 1;

                if (!isNaN(index) && bannedThreads[index]) {
                    const targetThread = bannedThreads[index];
                    const targetTID = targetThread.threadID;
                    const groupName = targetThread.threadInfo?.threadName || "This Group";

                    const currentThreadData = await threadsData.get(targetTID) || {};
                    const currentData = currentThreadData.data || {};
                    currentData.banned = {
                        status: false,
                        reason: null
                    };

                    await threadsData.set(targetTID, { data: currentData });

                    unbannedGroupNames.push(groupName);

                    const unbanNoticeMsg = `🌸 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 🌸
━━━━━━━━━━━━━━━
👥 𝐆𝐫𝐨𝐮𝐩 : ${groupName}

✅ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐍𝐁𝐀𝐍𝐍𝐄𝐃
🎉 এই গ্রুপের ব্যান উঠিয়ে দেওয়া হয়েছে!
✨ এখন থেকে আপনারা আগের মতোই বটের
সকল কমান্ড ব্যবহার করতে পারবেন।

━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;

                    api.sendMessage(unbanNoticeMsg, targetTID).catch(() => {});
                }
            }

            if (unbannedGroupNames.length > 0) {
                message.reply(`✅ সফলভাবে নিচের ${unbannedGroupNames.length}টি গ্রুপ আনব্যান করা হয়েছে:\n\n${unbannedGroupNames.map(n => `» 👥 ${n}`).join("\n")}`);
            } else {
                message.reply("❌ সঠিক ইনপুট নম্বর দেননি।");
            }
        }

        try {
            api.unsendMessage(replyData.messageID);
        } catch (e) {}
    }
};

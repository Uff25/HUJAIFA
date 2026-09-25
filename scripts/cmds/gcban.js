const { getTime } = global.utils;

function isBotAdmin(senderID) {
    const adminBot = global.GoatBot.config.adminBot || [];
    return adminBot.includes(senderID);
}

module.exports = {
    config: {
        name: "gcban",
        version: "1.0",
        author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        countDown: 5,
        role: 2,
        description: {
            bn: "গ্রুপ চ্যাট ব্যান ও ম্যানেজমেন্ট সিস্টেম",
            en: "Group chat ban and management system"
        },
        guide: {
            bn: "{pn} - সকল যুক্ত থাকা গ্রুপের লিস্ট দেখতে\n{pn} list - ব্যান থাকা গ্রুপগুলির লিস্ট দেখতে",
            en: "{pn} - Show all joined group list\n{pn} list - Show banned group list"
        },
        category: "owner"
    },

    onStart: async function ({ api, event, message, threadsData, args }) {
        if (!isBotAdmin(event.senderID)) {
            return message.reply("❌ অনলি মাই বস 𝐒𝐈𝐘𝐀𝐌 🧘🫣");
        }

        const type = (args[0] || "").toLowerCase();

        if (type === "list" || type === "-l") {
            const allThreads = await threadsData.getAll();
            const bannedThreads = allThreads.filter(
                t => t.data && t.data.banned && t.data.banned.status === true
            );

            if (bannedThreads.length === 0) {
                return message.reply(`━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
❌ বর্তমানে কোনো গ্রুপ ব্যান নেই!
━━━━━━━━━━━━━━━`);
            }

            let msg = `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐁𝐀𝐍𝐍𝐄𝐃-𝐆𝐂-𝐋𝐈𝐒𝐓
━━━━━━━━━━━━━━━\n`;

            bannedThreads.forEach((thread, index) => {
                msg += `[ ${index + 1} ] 📌 ${thread.threadName || "Unknown Group"}
     🆔 TID: ${thread.threadID}\n`;
            });

            msg += `\n» 🔰 আনব্যান করতে সেই নাম্বারটি লিখে (যেমন: 1 বা 1 2) এই মেসেজে রিপ্লাই দিন!
━━━━━━━━━━━━━━━`;

            return message.reply(msg, (err, info) => {
                if (err) return;
                if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "UNBAN_LIST",
                    bannedThreads
                });
            });
        }

        const allThreads = await threadsData.getAll();
        const activeThreads = allThreads.filter(t => t.isGroup !== false);

        if (activeThreads.length === 0) {
            return message.reply("❌ কোনো গ্রুপ ডাটা পাওয়া যায়নি!");
        }

        let listMsg = `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐓𝐎𝐓𝐀𝐋 𝐀𝐂𝐓𝐈𝐕𝐄 𝐆𝐑𝐎𝐔𝐏𝐒: ${activeThreads.length}
━━━━━━━━━━━━━━━\n`;

        activeThreads.forEach((thread, index) => {
            const isBanned = thread.data && thread.data.banned && thread.data.banned.status === true;
            listMsg += `[ ${index + 1} ] 📌 ${thread.threadName || "Unknown Group"}
     🆔 TID: ${thread.threadID} ${isBanned ? "(🚫 Banned)" : ""}\n`;
        });

        listMsg += `\n━━━━━━━━━━━━━━━
» 🐸 অ্যাকশন নিতে এই মেসেজে রিপ্লাই দিন:
» উদাহরণ: "1 ban" (ব্যান করতে)
» উদাহরণ: "1 out" (লিভ নিতে)
━━━━━━━━━━━━━━━`;

        return message.reply(listMsg, (err, info) => {
            if (err) return;
            if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();
            global.GoatBot.onReply.set(info.messageID, {
                commandName: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "MAIN_LIST",
                activeThreads
            });
        });
    },

    onAnyEvent: async function ({ event, threadsData }) {
        try {
            if (!event || !event.threadID) return;

            if (isBotAdmin(event.senderID)) return;

            const threadData = await threadsData.get(event.threadID);
            if (threadData && threadData.data && threadData.data.banned && threadData.data.banned.status === true) {
                event.body = ""; 
                delete event.name;
                throw new Error("THREAD_BANNED_IGNORE_EVENT");
            }
        } catch (e) {
        }
    },

    onReply: async function ({ event, api, handleReply, Reply, onReply, threadsData, message }) {
        const replyData = handleReply || Reply || onReply;
        if (!replyData) return;

        if (event.senderID !== replyData.author) return;

        const time = getTime("HH:mm:ss");
        const date = getTime("DD/MM/YYYY");
        const input = (event.body || "").trim().split(/\s+/);

        if (replyData.type === "MAIN_LIST") {
            const action = input[input.length - 1].toLowerCase();
            const indexes = input.slice(0, -1);

            if (action === "ban") {
                let successCount = 0;
                for (const numStr of indexes) {
                    const idx = parseInt(numStr) - 1;
                    const targetThread = replyData.activeThreads[idx];

                    if (targetThread) {
                        const tID = targetThread.threadID;

                        await threadsData.set(tID, {
                            data: {
                                ...(targetThread.data || {}),
                                banned: {
                                    status: true,
                                    date: `${date} - ${time}`
                                }
                            }
                        });

                        const gcNotice = `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐆𝐑𝐎𝐔𝐏-𝐁𝐀𝐍𝐍𝐄𝐃
━━━━━━━━━━━━━━━
» ❌ এই গ্রুপটি স্পাম করার 
» 😡 কারণে ব্যান করা হলো
» ⏰ 𝐓𝐢𝐦𝐞: ${time}
» 📅 𝐃𝐚𝐭𝐞: ${date}
» 📌 এখন কেউ বট ব্যবহার 
» 🔰 করতে পারবেন না
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;
                        try {
                            await api.sendMessage(gcNotice, tID);
                        } catch (e) {}

                        successCount++;
                    }
                }

                return message.reply(`━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
✅ সফলভাবে ${successCount} টি গ্রুপ ব্যান করা হয়েছে!
━━━━━━━━━━━━━━━`);
            } 
            
            else if (action === "out") {
                let leftCount = 0;
                for (const numStr of indexes) {
                    const idx = parseInt(numStr) - 1;
                    const targetThread = replyData.activeThreads[idx];

                    if (targetThread) {
                        const tID = targetThread.threadID;
                        try {
                            await api.removeUserFromGroup(api.getCurrentUserID(), tID);
                            leftCount++;
                        } catch (e) {}
                    }
                }

                return message.reply(`━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
✅ সফলভাবে ${leftCount} টি গ্রুপ থেকে লিভ নেওয়া হয়েছে!
━━━━━━━━━━━━━━━`);
            }
        }

        if (replyData.type === "UNBAN_LIST") {
            let unbannedCount = 0;
            for (const numStr of input) {
                const idx = parseInt(numStr) - 1;
                const targetThread = replyData.bannedThreads[idx];

                if (targetThread) {
                    const tID = targetThread.threadID;

                    await threadsData.set(tID, {
                        data: {
                            ...(targetThread.data || {}),
                            banned: {
                                status: false,
                                date: null
                            }
                        }
                    });

                    const unbanNotice = `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐆𝐑𝐎𝐔𝐏-𝐔𝐍𝐁𝐀𝐍𝐍𝐄𝐃
━━━━━━━━━━━━━━━
» ✅ এই গ্রুপটি সফলভাবে 
» 🐲 আনব্যান করা হয়েছে!
» 🌝 এখন থেকে সবাই বট 
» 🙄 ব্যবহার করতে পারবেন।
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;
                    try {
                        await api.sendMessage(unbanNotice, tID);
                    } catch (e) {}

                    unbannedCount++;
                }
            }

            return message.reply(`━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
✅ সফলভাবে ${unbannedCount} টি গ্রুপ আনব্যান করা হয়েছে!
━━━━━━━━━━━━━━━`);
        }
    }
};

const bannedGroupsList = new Map();
const userNoticeTracker = new Map();

function isBotAdmin(senderID) {
    const adminBot = global.GoatBot.config.adminBot || [];
    return adminBot.includes(senderID);
}

module.exports = {
    config: {
        name: "gcban",
        version: "2.5",
        author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        countDown: 5,
        role: 2, // অনলি এডমিন/বস ব্যবহার করতে পারবে
        description: {
            bn: "গ্রুপ ব্যান এবং আনব্যান সিস্টেম পরিচালনা করুন",
            en: "Manage group ban and unban system"
        },
        guide: {
            bn: "{pn} - সকল যুক্ত থাকা গ্রুপের তালিকা দেখতে\n{pn} list - ব্যান করা গ্রুপের তালিকা দেখতে",
            en: "{pn} - View all joined groups\n{pn} list - View banned groups"
        },
        category: "owner"
    },

    onStart: async function ({ args, threadsData, message, event, role, api }) {
        if (role < 2) {
            return message.reply("❌ অনলি মাই বস 𝐒𝐈𝐘𝐀𝐌 🧘🫣");
        }

        const type = (args[0] || "").toLowerCase();

        // ১. ব্যান করা গ্রুপের তালিকা দেখা
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
» 🌝 চান সেই নাম্বারটি (যেমন: 1 বা 1 2)
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

        // ২. বটের অল গ্রুপের লিস্ট দেখানো (ডিফল্ট `gcban` কমান্ডে)
        const allThreads = await threadsData.getAll();
        const activeThreads = allThreads.filter(t => t.threadID && (!t.data || !t.data.banned || !t.data.banned.status));

        if (activeThreads.length === 0) {
            return message.reply("❌ বর্তমানে কোনো অ্যাক্টিভ গ্রুপ পাওয়া যায়নি।");
        }

        let gcListText = "";
        activeThreads.forEach((thread, index) => {
            gcListText += `\n[ ${index + 1} ] 👥 𝐍𝐚𝐦𝐞: ${thread.threadInfo?.threadName || "Unknown Group"}\n     🆔 𝐓𝐈𝐃: ${thread.threadID}\n`;
        });

        const mainListForm = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐓𝐨𝐭𝐚𝐥 𝐀𝐜𝐭𝐢𝐯𝐞 𝐆𝐂: ${activeThreads.length}
🆔 𝐀𝐋𝐋-𝐆𝐑𝐎𝐔𝐏-𝐋𝐈𝐒𝐓
━━━━━━━━━━━━━━━
${gcListText}
━━━━━━━━━━━━━━━
» 🚫 যে গ্রুপ(গুলো) ব্যান করতে চান:
» 🔢 নাম্বার লিখে মেসেজে রিপ্লাই দিন।
» 💡 যেমন: "1" অথবা "1 ban" অথবা "1 2 ban"
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
                activeThreads
            });
        });
    },

    // ব্যান/আনব্যান এর জন্য স্পেশাল কোনো ফিল্টার বা প্রি-চেক সম্পূর্ণ সার্ভিস বন্ধ রাখতে
    onAnyEvent: async function ({ event, threadsData, message, prefix, api }) {
        try {
            if (!event || !event.threadID || !event.body) return;

            const threadID = event.threadID;
            const threadData = await threadsData.get(threadID);

            // চেক করা গ্রুপটি ব্যান আছে কিনা
            if (threadData && threadData.data && threadData.data.banned && threadData.data.banned.status === true) {
                const currentPrefix = prefix || global.GoatBot.config.prefix || "/";

                // যদি গ্রুপ ব্যান থাকে তবে যেকোনো কমান্ড বন্ধ থাকবে
                // যদি ইউজার বটের Prefix দিয়ে মেসেজ দেয়
                if (event.body.startsWith(currentPrefix)) {
                    const senderID = event.senderID;
                    const now = Date.now();
                    const userLastNotice = userNoticeTracker.get(`${threadID}_${senderID}`) || 0;

                    // প্রতি ইউজারের জন্য ১০ সেকেন্ডের মধ্যে একের বেশি মেসেজ পাঠাবে না
                    if (now - userLastNotice > 10000) {
                        userNoticeTracker.set(`${threadID}_${senderID}`, now);

                        const banNoticeText = `🌸 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 🌸
━━━━━━━━━━━━━━━
👥 𝐆𝐫𝐨𝐮𝐩 : ${threadData.threadInfo?.threadName || "This Group"}

🚫 𝐆𝐑𝐎𝐔𝐏 𝐁𝐀𝐍𝐍𝐄𝐃
❌ এই গ্রুপটি বট থেকে ব্যান করা হয়েছে।
⚠️ এই গ্রুপে বটের কোনো কমান্ড
🚫 কাজ করবে না।
📩 দয়া করে 𝐒𝐢𝐚𝐦  ভাইয়ের সাথে
যোগাযোগ করুন।

📱 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: +8801789138157
📘 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: wwww/68
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;

                        // মেসেজ পাঠাবে এবং ৩০ সেকেন্ড (30000 ms) পর অটো ডিলিট করে দেবে
                        message.reply(banNoticeText, (err, info) => {
                            if (!err && info && info.messageID) {
                                setTimeout(() => {
                                    api.unsendMessage(info.messageID).catch(() => {});
                                }, 30000);
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error("[GCBAN ERROR]", error);
        }
    },

    onReply: async function ({ event, api, handleReply, Reply, onReply, threadsData, message }) {
        const replyData = handleReply || Reply || onReply;
        if (!replyData) return;

        if (event.senderID !== replyData.author) return;

        const bodyText = (event.body || "").trim();
        const inputNumbers = bodyText.replace(/ban/gi, "").trim().split(/\s+/);

        // ১. গ্রুপ ব্যান প্রসেসিং
        if (replyData.type === "ban") {
            const activeThreads = replyData.activeThreads || [];
            let bannedGroupNames = [];

            for (const numStr of inputNumbers) {
                const cleanNumber = numStr.replace(/[^\d]/g, "");
                const index = parseInt(cleanNumber) - 1;

                if (!isNaN(index) && activeThreads[index]) {
                    const targetThread = activeThreads[index];
                    const targetTID = targetThread.threadID;
                    const groupName = targetThread.threadInfo?.threadName || "This Group";

                    // ডেটাবেজে গ্রুপ ব্যান করা
                    const currentData = targetThread.data || {};
                    currentData.banned = {
                        status: true,
                        reason: "Banned by Admin/Owner"
                    };

                    await threadsData.set(targetTID, { data: currentData });

                    bannedGroupNames.push(groupName);

                    // ওই নির্দিষ্ট গ্রুপে ব্যান মেসেজ পাঠানো
                    const banNoticeMsg = `🌸 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 🌸
━━━━━━━━━━━━━━━
👥 𝐆𝐫𝐨𝐮𝐩 : ${groupName}

🚫 𝐆𝐑𝐎𝐔𝐏 𝐁𝐀𝐍𝐍𝐄𝐃
❌ এই গ্রুপটি বট থেকে ব্যান করা হয়েছে।
⚠️ এই গ্রুপে বটের কোনো কমান্ড
🚫 কাজ করবে না।
📩 দয়া করে 𝐒𝐢𝐚𝐦  ভাইয়ের সাথে
যোগাযোগ করুন।

📱 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: +8801789138157
📘 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: wwww/68
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;

                    api.sendMessage(banNoticeMsg, targetTID).catch(() => {});
                }
            }

            if (bannedGroupNames.length > 0) {
                message.reply(`✅ সফলভাবে নিচের ${bannedGroupNames.length}টি গ্রুপ ব্যান করা হয়েছে এবং মেসেজ পাঠানো হয়েছে:\n\n${bannedGroupNames.map(n => `» 👥 ${n}`).join("\n")}`);
            } else {
                message.reply("❌ সঠিক ইনপুট নম্বর দেননি।");
            }
        }

        // ২. গ্রুপ আনব্যান প্রসেসিং
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

                    // ডেটাবেজে আনব্যান করা
                    const currentData = targetThread.data || {};
                    currentData.banned = {
                        status: false,
                        reason: null
                    };

                    await threadsData.set(targetTID, { data: currentData });

                    unbannedGroupNames.push(groupName);

                    // ওই নির্দিষ্ট গ্রুপে আনব্যান মেসেজ পাঠানো
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

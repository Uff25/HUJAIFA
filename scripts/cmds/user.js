const { getTime } = global.utils;

const bannedWarningData = new Map();
const userCommandTracker = new Map();

function isBotAdmin(senderID) {
    const adminBot = global.GoatBot.config.adminBot || [];
    return adminBot.includes(senderID);
}

module.exports = {
    config: {
        name: "user",
        version: "2.3",
        author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        countDown: 5,
        role: 0,
        description: {
            vi: "Quản lý người dùng trong hệ thống bot",
            en: "Manage users in bot system"
        },
        guide: {
            bn: "{pn} ban <userID/mention/reply> <reason> - ইউজারকে ব্যান করার জন্য\n{pn} unban <userID/mention/reply> - ইউজারকে আনব্যান করার জন্য\n{pn} list - ব্যান করা ইউজারদের তালিকা দেখতে\n{pn} find <name> - ইউজার আইডি খোঁজার জন্য",
            en: "{pn} ban <userID/mention/reply> <reason> - Ban a user\n{pn} unban <userID/mention/reply> - Unban a user\n{pn} list - View list of banned users\n{pn} find <name> - Search for user ID"
        },
        category: "owner"
    },

    langs: {
        vi: {
            noUserFound: "❌ Không tìm thấy người dùng nào có tên khớp với từ khóa: \"%1\" trong dữ liệu của bot",
            userFound: "🔎 Tìm thấy %1 người dùng có tên trùng với từ khóa \"%2\" trong dữ liệu của bot:\n%3",
            uidRequired: "Uid của người cần ban không được để trống",
            reasonRequired: "Lý do ban người dùng không được để trống",
            userHasBanned: "Người dùng mang id [%1 | %2] đã bị cấm từ trước:\n» Lý do: %3\n» Thời gian: %4",
            userBanned: "Đã cấm người dùng mang id [%1 | %2] sử dụng bot.\n» Lý do: %3\n» Thời gian: %4",
            uidRequiredUnban: "Uid của người cần unban không được để trống",
            userNotBanned: "Hiện tại người dùng mang id [%1 | %2] không bị cấm sử dụng bot",
            userUnbanned: "Đã bỏ cấm người dùng mang id [%1 | %2], hiện tại người này có thể sử dụng bot"
        },
        en: {
            noUserFound: "❌ No user found with name matching keyword: \"%1\" in bot data",
            userFound: "🔎 Found %1 user with name matching keyword \"%2\" in bot data:\n%3",
            uidRequired: "Uid of user to ban cannot be empty",
            reasonRequired: "Reason to ban user cannot be empty",
            userHasBanned: "User with id [%1 | %2] has been banned before:\n» Reason: %3\n» Date: %4",
            userBanned: "User with id [%1 | %2] has been banned:\n» Reason: %3\n» Date: %4",
            uidRequiredUnban: "Uid of user to unban cannot be empty",
            userNotBanned: "User with id [%1 | %2] is not banned",
            userUnbanned: "User with id [%1 | %2] has been unbanned"
        }
    },

    onStart: async function ({
        args,
        usersData,
        message,
        event,
        getLang,
        role
    }) {
        const type = (args[0] || "").toLowerCase();

        switch (type) {
            case "find":
            case "-f":
            case "search":
            case "-s": {
                const keyWord = args.slice(1).join(" ");
                if (!keyWord) return message.reply("❌ খোঁজার জন্য একটি নাম লিখুন!");

                const allUser = await usersData.getAll();
                const result = allUser.filter(item =>
                    (item.name || "").toLowerCase().includes(keyWord.toLowerCase())
                );

                const msg = result.reduce(
                    (i, user) => i + `\n╭𝐍𝐚𝐦𝐞: ${user.name || "Unknown"}\n╰𝐈𝐃: ${user.userID}`,
                    ""
                );

                return message.reply(
                    result.length === 0
                        ? getLang("noUserFound", keyWord)
                        : getLang("userFound", result.length, keyWord, msg)
                );
            }

            case "ban":
            case "-b": {
                if (role < 2) {
                    return message.reply("❌ অনলি মাই বস 𝐒𝐈𝐘𝐀𝐌 🧘🫣");
                }

                let uid;
                let reason;

                if (event.type === "message_reply") {
                    uid = event.messageReply.senderID;
                    reason = args.slice(1).join(" ");
                } else if (event.mentions && Object.keys(event.mentions).length > 0) {
                    const mentions = event.mentions;
                    uid = Object.keys(mentions)[0];
                    reason = args.slice(1).join(" ").replace(mentions[uid] || "", "").trim();
                } else if (args[1]) {
                    uid = args[1];
                    reason = args.slice(2).join(" ");
                } else {
                    return message.SyntaxError();
                }

                if (!uid) return message.reply(getLang("uidRequired"));

                if (isBotAdmin(uid)) {
                    return message.reply("❌ উসটা খাবি সব এখান থেকে🌚🙄🐸");
                }

                if (!reason || !reason.trim()) return message.reply(getLang("reasonRequired"));

                reason = reason.replace(/\s+/g, " ").trim();
                const userData = await usersData.get(uid);

                if (!userData) return message.reply(getLang("uidRequired"));

                const name = userData.name || "Unknown";
                const isBanned = userData.banned && userData.banned.status === true;

                if (isBanned) {
                    return message.reply(
                        getLang(
                            "userHasBanned",
                            uid,
                            name,
                            userData.banned.reason || "No reason",
                            userData.banned.date || "Unknown"
                        )
                    );
                }

                const time = getTime("HH:mm:ss");
                const date = getTime("DD/MM/YYYY");

                await usersData.set(uid, {
                    banned: {
                        status: true,
                        reason,
                        date: `${date} - ${time}`,
                        timeOnly: time,
                        dateOnly: date
                    }
                });

                bannedWarningData.delete(uid);
                userCommandTracker.delete(uid);

                const banSuccessMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐁𝐀𝐍-𝐒𝐔𝐂𝐂𝐄𝐒𝐒
━━━━━━━━━━━━━━━
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
» ⏰ 𝐓𝐢𝐦𝐞: ${time}
» 📅 𝐃𝐚𝐭𝐞: ${date}
» 📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${reason}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

                return message.reply(banSuccessMsg);
            }

            case "unban":
            case "-u": {
                if (role < 2) {
                    return message.reply("❌ অনলি মাই বয় বস 𝐒𝐈𝐘𝐀𝐌!");
                }

                let uid;

                if (event.type === "message_reply") {
                    uid = event.messageReply.senderID;
                } else if (event.mentions && Object.keys(event.mentions).length > 0) {
                    uid = Object.keys(event.mentions)[0];
                } else if (args[1]) {
                    uid = args[1];
                } else {
                    return message.SyntaxError();
                }

                if (!uid) return message.reply(getLang("uidRequiredUnban"));

                const userData = await usersData.get(uid);
                if (!userData) return message.reply(getLang("uidRequiredUnban"));

                const name = userData.name || "Unknown";
                const isBanned = userData.banned && userData.banned.status === true;

                if (!isBanned) {
                    return message.reply(getLang("userNotBanned", uid, name));
                }

                await usersData.set(uid, {
                    banned: {
                        status: false,
                        reason: null,
                        date: null,
                        timeOnly: null,
                        dateOnly: null
                    }
                });

                bannedWarningData.delete(uid);
                userCommandTracker.delete(uid);

                const unbanSuccessMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐔𝐍𝐁𝐀𝐍-𝐒𝐔𝐂𝐂𝐄𝐒𝐒
━━━━━━━━━━━━━━━
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

                return message.reply(unbanSuccessMsg);
            }

            case "list":
            case "-l": {
                const allUser = await usersData.getAll();
                const bannedUsers = allUser.filter(
                    item => item.banned && item.banned.status === true
                );

                if (bannedUsers.length === 0) {
                    const noBanMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐁𝐀𝐍-𝟎𝟎
━━━━━━━━━━━━━━━
» ❌ বর্তমানে কোনো 
» 😭 ব্যান ইউজার নেই!
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;
                    return message.reply(noBanMsg);
                }

                let listText = "";
                bannedUsers.forEach((user, index) => {
                    const timeOnly = user.banned.timeOnly || (user.banned.date ? user.banned.date.split(" ")[1] : "Unknown");
                    const dateOnly = user.banned.dateOnly || (user.banned.date ? user.banned.date.split(" ")[0] : "Unknown");

                    listText += `
[ ${index + 1} ] 👤 𝐍𝐚𝐦𝐞: ${user.name || "Unknown"}
     🆔 𝐔𝐈𝐃: ${user.userID}
     📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${user.banned.reason || "No reason"}
     ⏰ 𝐓𝐢𝐦𝐞: ${timeOnly}
     📅 𝐃𝐚𝐭𝐞: ${dateOnly}
`;
                });

                const form = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐓𝐨𝐭𝐚𝐥 𝐁𝐚𝐧𝐧𝐞𝐝: ${bannedUsers.length}
🆔 𝐁𝐀𝐍-𝐋𝐈𝐒𝐓
━━━━━━━━━━━━━━━
${listText}
» 🔰 যে ইউজারকে
» 🌚 আনব্যান করতে 
» 🫠 চান সেই নাম্বারটি
» 😂 যেমন: 1 2 বা 1 
» 🙄 এই মেসেজে রিপ্লাই দিন:
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
                        bannedUsers
                    });
                });
            }

            default:
                return message.SyntaxError();
        }
    },

    onAnyEvent: async function ({
        event,
        usersData,
        message,
        prefix
    }) {
        try {
            if (!event || !event.senderID || !event.body) return;

            const uid = event.senderID;
            const currentPrefix = prefix || global.GoatBot.config.prefix || "/";

            if (!event.body.startsWith(currentPrefix)) return;

            const userData = await usersData.get(uid);

            if (userData && userData.banned && userData.banned.status === true) {
                let warningCount = bannedWarningData.get(uid) || 0;

                if (warningCount < 3) {
                    warningCount += 1;
                    bannedWarningData.set(uid, warningCount);

                    const name = userData.name || "Unknown";
                    const reason = userData.banned.reason || "No reason";
                    const timeOnly = userData.banned.timeOnly || "Unknown";
                    const dateOnly = userData.banned.dateOnly || "Unknown";

                    const defaultBanMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐁𝐀𝐍-𝐍𝐎𝐓𝐈𝐂𝐄
━━━━━━━━━━━━━━━
» ❌ আপনি ban আছেন!
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
» 📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${reason}
» ⏰ 𝐓𝐢𝐦𝐞: ${timeOnly}
» 📅 𝐃𝐚𝐭𝐞: ${dateOnly}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

                    return message.reply(`${defaultBanMsg}\n\n⚠️ (Warning Notice: ${warningCount}/3)`);
                } else {
                    return;
                }
            }

            if (isBotAdmin(uid)) return;

            const now = Date.now();
            let tracker = userCommandTracker.get(uid) || { timestamps: [], count: 0 };

            tracker.timestamps = tracker.timestamps.filter(timestamp => now - timestamp < 10000);
            tracker.timestamps.push(now);
            tracker.count += 1;

            userCommandTracker.set(uid, tracker);

            const isFastSpam = tracker.timestamps.length >= 5;
            const isTotalSpam = tracker.count >= 12;

            if (isFastSpam || isTotalSpam) {
                const time = getTime("HH:mm:ss");
                const date = getTime("DD/MM/YYYY");
                const name = userData ? (userData.name || "Unknown") : "Unknown";
                const reason = isFastSpam ? "Spamming commands too fast 😴" : "Excessive bot command usage 🌚";

                await usersData.set(uid, {
                    banned: {
                        status: true,
                        reason: reason,
                        date: `${date} - ${time}`,
                        timeOnly: time,
                        dateOnly: date
                    }
                });

                userCommandTracker.delete(uid);
                bannedWarningData.set(uid, 1);

                const autoBanNotice = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐀𝐔𝐓𝐎-𝐁𝐀𝐍𝐍𝐄𝐃
━━━━━━━━━━━━━━━
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
» ⏰ 𝐓𝐢𝐦𝐞: ${time}
» 📅 𝐃𝐚𝐭𝐞: ${date}
» 📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${reason}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

                return message.reply(autoBanNotice);
            }
        } catch (error) {
            console.error("[USER BAN SYSTEM ERROR]", error);
        }
    },

    onReply: async function ({
        event,
        api,
        handleReply,
        Reply,
        onReply,
        usersData,
        message
    }) {
        const replyData = handleReply || Reply || onReply;
        if (!replyData) return;

        if (event.senderID !== replyData.author) return;

        const input = (event.body || "").trim().split(/\s+/);
        const bannedUsers = replyData.bannedUsers || [];

        let unbannedUserNames = [];
        const failedNames = [];

        for (const numStr of input) {
            const cleanNumber = numStr.replace(/[^\d]/g, "");
            const index = parseInt(cleanNumber) - 1;

            if (!isNaN(index) && bannedUsers[index]) {
                const targetUser = bannedUsers[index];

                await usersData.set(targetUser.userID, {
                    banned: {
                        status: false,
                        reason: null,
                        date: null,
                        timeOnly: null,
                        dateOnly: null
                    }
                });

                bannedWarningData.delete(targetUser.userID);
                userCommandTracker.delete(targetUser.userID);

                unbannedUserNames.push(targetUser.name || "Unknown User");
            } else {
                failedNames.push(numStr);
            }
        }

        let unbannedText = unbannedUserNames.length > 0
            ? unbannedUserNames.map(name => `» 👤 ${name}`).join("\n")
            : "» ❌ কোনো ইউজারের নাম পাওয়া যায়নি!";

        let resultMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🆔 𝐔𝐍𝐁𝐀𝐍-𝐑𝐄𝐒
━━━━━━━━━━━━━━━
${unbannedText}
» ✅ সফলভাবে আনব্যান 
» 🌝 করা হয়েছে!`;

        if (failedNames.length > 0) {
            resultMsg += `\n» ⚠️ ভুল নাম্বার: ${failedNames.join(", ")}`;
        }

        resultMsg += `
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

        return message.reply(resultMsg, () => {
            if (api && typeof api.unsendMessage === "function") {
                api.unsendMessage(replyData.messageID).catch(() => {});
            }
        });
    }
};

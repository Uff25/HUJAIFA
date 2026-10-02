const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "supportgc",
    aliases: ["supportbox"],
    version: "3.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,

    shortDescription: {
      en: "Add mentioned user to support group"
    },

    longDescription: {
      en: "Mention user and add into support group"
    },

    category: "support",

    guide: {
      en: "/supportgc @mention"
    }
  },

  onStart: async function ({ api, event }) {

    const supportGroupId = "2060810454480041";
    const adminUID = "61560326905548";
    const commandThreadID = event.threadID;

    // Mention System
    const mention = Object.keys(event.mentions)[0];
    const userID = mention || event.senderID;

    // Real Time
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");

    // Uptime
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const botUptime = `${hours}h ${minutes}m ${seconds}s`;

    // Premium Design
    const top = `
╔═══════════════╗
       👑 𝗦𝗜𝗬𝗔𝗠 𝗛𝗔𝗦𝗔𝗡 👑
╚═══════════════╝`;

    const bottom = `
╔══════════════╗
       👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 👑
╚══════════════╝`;

    try {

      // User Info
      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID].name;

      // Support Group Info
      const threadInfo = await api.getThreadInfo(supportGroupId);
      const participantIDs = threadInfo.participantIDs;

      // Already Added
      if (participantIDs.includes(userID)) {

        return api.sendMessage(
`${top}

⚠️ 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐈𝐍 𝐆𝐑𝐎𝐔𝐏

👤 নাম : ${userName}

🆔 UID : ${userID}

📌 এই ইউজার আগে থেকেই Support Group এ আছে।

━━━━━━━━━━━━━━━━━━
⏰ সময় : ${time}
📅 তারিখ : ${date}
🚀 Bot Uptime : ${botUptime}
━━━━━━━━━━━━━━━━━━

${bottom}`,
commandThreadID
        );
      }

      // Add User
      api.addUserToGroup(userID, supportGroupId, async (err) => {

        // Failed
        if (err) {

          return api.sendMessage(
`${top}

❌ 𝐔𝐒𝐄𝐑 𝐀𝐃𝐃 𝐅𝐀𝐈𝐋𝐄𝐃

👤 নাম : ${userName}

🆔 UID : ${userID}

⚠️ ইউজারকে Support Group এ Add করা যায়নি।

🔒 Possible Reasons:
• Account Private
• User Blocked Bot
• Message Request Off

━━━━━━━━━━━━━━━━━━
⏰ সময় : ${time}
📅 তারিখ : ${date}
🚀 Bot Uptime : ${botUptime}
━━━━━━━━━━━━━━━━━━

${bottom}`,
commandThreadID
          );
        }

        // Success Message
        api.sendMessage(
`${top}

✅ 𝐔𝐒𝐄𝐑 𝐀𝐃𝐃𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘

👤 নাম : ${userName}

🆔 UID : ${userID}

🎉 ইউজারকে সফলভাবে Support Group এ Add করা হয়েছে।

━━━━━━━━━━━━━━━━━━
⏰ সময় : ${time}
📅 তারিখ : ${date}
🚀 Bot Uptime : ${botUptime}
━━━━━━━━━━━━━━━━━━

${bottom}`,
commandThreadID
        );

        // Notification Message
        const notificationMessage =
`${top}

📌 𝐍𝐄𝐖 𝐔𝐒𝐄𝐑 𝐉𝐎𝐈𝐍

👤 নাম : ${userName}

🆔 UID : ${userID}

✅ নতুন ইউজার Support Group এ যুক্ত হয়েছে।

━━━━━━━━━━━━━━━━━━
⏰ সময় : ${time}
📅 তারিখ : ${date}
🚀 Bot Uptime : ${botUptime}
━━━━━━━━━━━━━━━━━━

${bottom}`;

        // Send Support Group
        api.sendMessage(notificationMessage, supportGroupId);

        // Send Admin Inbox
        api.sendMessage(notificationMessage, adminUID);

      });

    } catch (e) {

      api.sendMessage(
`${top}

❌ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐄𝐑𝐑𝐎𝐑

⚠️ কমান্ড চালাতে সমস্যা হয়েছে।

📝 Error:
${e.message}

━━━━━━━━━━━━━━━━━━
⏰ সময় : ${time}
📅 তারিখ : ${date}
━━━━━━━━━━━━━━━━━━

${bottom}`,
event.threadID
      );
    }
  }
};

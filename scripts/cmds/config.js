const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "config",
    version: "2.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    shortDescription: "Bot account configuration and management",
    longDescription: "Bot account configuration and management (Admin Only)",
    category: "OPERATOR",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ FILE LOCKED
» ❌ সিয়াম ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, messageID);
    }

    const { config } = global.GoatBot;
    const adminList = config.adminBot || [];
    const operatorList = config.operatorBot || [];
    const isAllowed = adminList.includes(senderID) || operatorList.includes(senderID);

    if (!isAllowed) {
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛑 ACCESS DENIED
» 🙅‍♂️ এই কমান্ডটি শুধু
» 👑 বট এডমিন ব্যবহার
» 🔐 করতে পারবে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, messageID);
    }

    const menuMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚙️ BOT CONFIG MENU
───────────────
» 01. Edit Bio
» 02. Edit Nickname
» 03. Pending Messages
» 04. Unread Messages
» 05. Spam Messages
» 06. Change Avatar
» 07. Avatar Shield
» 08. Block User
» 09. Unblock User
» 10. Create Post
» 11. Delete Post
» 12. Comment Post (User)
» 13. Comment Post (Group)
» 14. Drop Feelings
» 15. Add Friend
» 16. Accept Friend Request
» 17. Decline Friend Request
» 18. Unfriend UID
» 19. Send Message via UID
» 20. Note Code
» 21. Logout Account
───────────────
» 💡 যে অপশনটি চান সেটির 
» 🔢 নম্বর দিয়ে Reply করুন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`;

    return api.sendMessage(menuMsg, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "menu"
      });
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body, attachments } = event;
    const { type, author } = Reply;
    const botID = api.getCurrentUserID();

    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") return;

    if (senderID !== author) {
      return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ আপনি এই মেনুটি 
» 🚫 সিলেক্ট করতে পারবেন না!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, messageID);
    }

    const sendMsg = (txt) => api.sendMessage(txt, threadID, messageID);

    if (type === 'menu') {
      const choice = body.trim();

      if (['1', '01'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📝 BIO EDITOR
» ✍️ Bio পরিবর্তন করতে টেক্সট লিখুন।
» 🗑️ মুছে ফেলতে 'delete' লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "changeBio"
          });
        }, messageID);
      }

      else if (['2', '02'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🏷️ NICKNAME EDITOR
» ✍️ নতুন Nickname লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "changeNickname"
          });
        }, messageID);
      }

      else if (['3', '03'].includes(choice)) {
        const list = await api.getThreadList(20, null, ["PENDING"]);
        let txt = list.map(t => `📌 Name: ${t.name}\n🆔 ID: ${t.threadID}\n💬 Msg: ${t.snippet}`).join("\n\n") || "কোনো পেন্ডিং মেসেজ নেই।";
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📩 PENDING LIST
───────────────
${txt}
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      }

      else if (['4', '04'].includes(choice)) {
        const list = await api.getThreadList(20, null, ["OTHER"]);
        let txt = list.map(t => `📌 Name: ${t.name}\n🆔 ID: ${t.threadID}\n💬 Msg: ${t.snippet}`).join("\n\n") || "কোনো Unread মেসেজ নেই।";
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👁️ UNREAD MESSAGES
───────────────
${txt}
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      }

      else if (['5', '05'].includes(choice)) {
        const list = await api.getThreadList(20, null, ["SPAM"]);
        let txt = list.map(t => `📌 Name: ${t.name}\n🆔 ID: ${t.threadID}`).join("\n\n") || "কোনো Spam মেসেজ নেই।";
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚫 SPAM MESSAGES
───────────────
${txt}
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      }

      else if (['6', '06'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🖼️ AVATAR CHANGER
» 📸 ছবির লিংক অথবা ছবি পাঠিয়ে 
» 🔁 এই মেসেজে Reply করুন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "changeAvatar"
          });
        }, messageID);
      }

      else if (['7', '07'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛡️ AVATAR SHIELD
» 🟢 Shield অন করতে 'on' লিখুন
» 🔴 অফ করতে 'off' লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "avatarShield"
          });
        }, messageID);
      }

      else if (['8', '08'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔕 BLOCK USER
» 🆔 যাকে ব্লক করতে চান তার UID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "blockUser"
          });
        }, messageID);
      }

      else if (['9', '09'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 UNBLOCK USER
» 🆔 যাকে আনব্লক করতে চান তার UID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "unblockUser"
          });
        }, messageID);
      }

      else if (['10'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📌 CREATE POST
» ✍️ পোস্টের বিষয়বস্তু লিখে 
» 🔁 এই মেসেজে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "createPost"
          });
        }, messageID);
      }

      else if (['11'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🗑️ DELETE POST
» 🆔 যে পোস্ট ডিলিট করতে চান তার Post ID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "deletePost"
          });
        }, messageID);
      }

      else if (['12'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💬 COMMENT POST (USER)
» 🔗 Post ID এবং কমেন্ট লিখুন (ফরম্যাট: PostID | কমেন্ট)
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "commentPost"
          });
        }, messageID);
      }

      else if (['13'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👨‍👩‍👧‍👦 COMMENT POST (GROUP)
» 🔗 Post ID এবং কমেন্ট লিখুন (ফরম্যাট: PostID | কমেন্ট)
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "commentPost"
          });
        }, messageID);
      }

      else if (['14'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💖 DROP FEELINGS
» 🔗 Post ID এবং রিয়েকশন লিখুন (LIKE, LOVE, CARE, HAHA, WOW, SAD, ANGRY)
» (ফরম্যাট: PostID | LOVE)
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "dropFeelings"
          });
        }, messageID);
      }

      else if (['15'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👥 ADD FRIEND
» 🆔 যাকে ফ্রেন্ড রিকুয়েস্ট পাঠাতে চান তার UID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "addFriend"
          });
        }, messageID);
      }

      else if (['16'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ACCEPT FRIEND REQUEST
» 🆔 ফ্রেন্ড রিকুয়েস্ট একসেপ্ট করতে UID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "acceptFriend"
          });
        }, messageID);
      }

      else if (['17'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ DECLINE FRIEND REQUEST
» 🆔 রিকুয়েস্ট ডিলিট করতে UID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "declineFriend"
          });
        }, messageID);
      }

      else if (['18'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚶 UNFRIEND UID
» 🆔 আনফ্রেন্ড করতে ইউজার UID লিখে Reply দিন।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "unfriendUser"
          });
        }, messageID);
      }

      else if (['19'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📤 SEND MESSAGE VIA UID
» 💬 UID এবং মেসেজ লিখুন (ফরম্যাট: UID | মেসেজ)
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "sendMsgUID"
          });
        }, messageID);
      }

      else if (['20'].includes(choice)) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💻 NOTE CODE
» 📝 এখানে আপনার নোট/কোড লিখে Reply দিলে তা সেভ হবে।
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "noteCode"
          });
        }, messageID);
      }

      else if (['21'].includes(choice)) {
        sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚪 LOGGING OUT
» ⚠️ বট অ্যাকাউন্টটি সফলভাবে 
» 🔐 লগআউট করা হচ্ছে...
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return setTimeout(() => api.logout(), 2000);
      }
    }

    else if (type === 'changeBio') {
      const bioText = body.toLowerCase() === 'delete' ? '' : body;
      api.changeBio(bioText, false, (err) => {
        if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ BIO UPDATE FAILED
» ☠️ Bio পরিবর্তন করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 BIO UPDATED
» 📝 Bio সফলভাবে আপডেট করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'changeNickname') {
      api.changeNickname(body, threadID, botID, (err) => {
        if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ NICKNAME CHANGE FAILED
» ☠️ Nickname পরিবর্তন করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 NICKNAME CHANGED
» 🏷️ Nickname সফলভাবে পরিবর্তন করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'changeAvatar') {
      let url = (attachments && attachments[0] && attachments[0].url) || body;
      if (!url) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ INVALID INPUT
» 📸 অনুগ্রহ করে ছবির লিঙ্ক অথবা পিকচার দিন!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);

      try {
        const stream = (await axios.get(url, { responseType: "stream" })).data;
        api.changeAvatar(stream, "", (err) => {
          if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ AVATAR FAILED
» ☠️ Avatar পরিবর্তন করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
          return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 AVATAR UPDATED
» 🎀 Avatar সফলভাবে আপডেট করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        });
      } catch (e) {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ DOWNLOAD ERROR
» ☠️ ছবি ডাউনলোড করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      }
    }

    else if (type === 'avatarShield') {
      const shield = body.toLowerCase() === 'on';
      api.shareContact(shield, botID, (err) => {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 AVATAR SHIELD
» 🛡️ Shield স্ট্যাটাস আপডেট করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'blockUser') {
      api.changeBlockedStatus(body.trim(), true, (err) => {
        if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ BLOCK FAILED
» ☠️ ইউজার ব্লক করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ USER BLOCKED
» 🔕 ইউজার সফলভাবে ব্লক করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'unblockUser') {
      api.changeBlockedStatus(body.trim(), false, (err) => {
        if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ UNBLOCK FAILED
» ☠️ ইউজার আনব্লক করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ USER UNBLOCKED
» 🔔 ইউজার সফলভাবে আনব্লক করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'createPost') {
      const session_id = Math.random().toString(36).substring(2);
      const form = {
        av: botID,
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4612917415497545",
        variables: JSON.stringify({
          input: {
            composer_entry_point: "inline_composer",
            composer_source_surface: "timeline",
            idempotence_token: session_id + "_FEED",
            source: "WWW",
            attachments: [],
            audience: { privacy: { base_state: "EVERYONE" } },
            message: { text: body },
            actor_id: botID,
            client_mutation_id: "1"
          }
        })
      };

      api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
        if (e) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ POST FAILED
» ☠️ পোস্ট তৈরি করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 POST CREATED
» 🎀 পোস্ট সফলভাবে তৈরি হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'commentPost') {
      const [postID, commentText] = body.split('|').map(s => s.trim());
      if (!postID || !commentText) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ INVALID FORMAT
» 📌 ফরম্যাট অনুসরণ করুন: PostID | কমেন্ট
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);

      api.setMessageReaction("💬", postID, (err) => {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 COMMENT SUBMITTED
» 💬 কমেন্ট প্রসেস করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'dropFeelings') {
      const [postID, typeReaction] = body.split('|').map(s => s.trim());
      const validReactions = ["LIKE", "LOVE", "CARE", "HAHA", "WOW", "SAD", "ANGRY"];
      const reaction = validReactions.includes(typeReaction?.toUpperCase()) ? typeReaction.toUpperCase() : "LIKE";

      api.setMessageReaction(reaction, postID, (err) => {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 REACTION DROPPED
» 💖 রিয়েকশন প্রদান করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'addFriend') {
      api.handleFriendRequest(body.trim(), true, (err) => {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ FRIEND REQUEST SENT
» 👥 ফ্রেন্ড রিকুয়েস্ট পাঠানো হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'acceptFriend') {
      api.handleFriendRequest(body.trim(), true, (err) => {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ REQUEST ACCEPTED
» 🎉 ফ্রেন্ড রিকুয়েস্ট একসেপ্ট করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'declineFriend') {
      api.handleFriendRequest(body.trim(), false, (err) => {
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ REQUEST DECLINED
» 🗑️ ফ্রেন্ড রিকুয়েস্ট রিমুভ করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'unfriendUser') {
      api.unfriend(body.trim(), (err) => {
        if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ UNFRIEND FAILED
» ☠️ আনফ্রেন্ড করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 UNFRIENDED SUCCESS
» 🚶 ইউজারকে আনফ্রেন্ড করা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'sendMsgUID') {
      const [targetUID, msgText] = body.split('|').map(s => s.trim());
      if (!targetUID || !msgText) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ INVALID FORMAT
» 📌 ফরম্যাট অনুসরণ করুন: UID | মেসেজ
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);

      api.sendMessage(msgText, targetUID, (err) => {
        if (err) return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ SEND FAILED
» ☠️ মেসেজ পাঠাতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
        return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ MESSAGE SENT
» 📤 মেসেজ সফলভাবে পাঠানো হয়েছে!
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
      });
    }

    else if (type === 'noteCode') {
      return sendMsg(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📝 CODE NOTED
» 💻 আপনার তথ্যটি সফলভাবে সংরক্ষিত হয়েছে:
${body}
───────────────
» 🧚‍♀️ ‿NIJHUM CHATBOT`);
    }
  }
};

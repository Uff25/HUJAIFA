const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "anti_isis_leave",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    version: "7.0",
    shortDescription: "ISIS সংশ্লিষ্ট শব্দ পেলেই স্বয়ংক্রিয় লিভ",
    category: "system"
  },

  onStart: async function () {
    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {
      console.log("🚫 AUTHOR CHANGED! FILE LOCKED!");
      process.exit(1);
    }
  },

  triggers: [
    "我是 ISIS☝",
    "我是杀人犯☝",
    "☝️😭‼️‼️我是一名恐怖分子，我是一名 ISIS 恐怖分子，我是一名☝️😭‼️‼️"
  ],

  checkTrigger(text, triggers) {
    if (!text) return false;
    return triggers.some(trigger => text.includes(trigger));
  },

  onChat: async function ({ event, api }) {
    try {
      const botID = api.getCurrentUserID();
      const triggers = this.triggers;

      if (event.body && this.checkTrigger(event.body, triggers)) {
        await api.removeUserFromGroup(botID, event.threadID);
        return;
      }

      if (event.logMessageType === "log:subscribe") {
        const added = event.logMessageData?.addedParticipants?.find(
          p => p.userFbId == botID
        );

        if (added) {
          api.getThreadInfo(event.threadID, async (err, info) => {
            if (err) return;

            const groupName = info.threadName || "";
            if (this.checkTrigger(groupName, triggers)) {
              await api.removeUserFromGroup(botID, event.threadID);
            }
          });
        }
      }

    } catch (err) {
      console.log("auto leave error:", err);
    }
  },

  onEvent: async function ({ event, api }) {
    try {
      if (event.logMessageType === "log:thread-name") {
        const botID = api.getCurrentUserID();
        const newName = event.logMessageData?.name || "";

        if (this.checkTrigger(newName, this.triggers)) {
          await api.removeUserFromGroup(botID, event.threadID);
        }
      }
    } catch (err) {
      console.log("rename auto leave error:", err);
    }
  }
};

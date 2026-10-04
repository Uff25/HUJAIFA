const axios = require("axios");

module.exports = {
  config: {
    name: "latti",
    version: "10.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 3,
    role: 0,
    shortDescription: "latti mare 😈",
    category: "fun",
    guide: {
      en: "{pn} (reply someone)"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID, messageReply } = event;

    try {
      if (!messageReply) {
        const noReplyMsg = 
`» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑
───────────────
» 🦵 কাকে ফুটবলের মতো কিক 
» 😈 মারবি তাকে রিপ্লাই দে
───────────────
» 🧚‍♀️ ‿𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noReplyMsg, threadID, messageID);
      }

      const targetID = messageReply.senderID;
      const url = `https://sayem-meme-apixs.onrender.com/usta?senderID=${senderID}&targetID=${targetID}`;

      const res = await axios.get(url, {
        responseType: "stream"
      });

      const successMsg = 
`» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑
───────────────
» 💢 এই নে তুই লাথি খা!🦵
» 😈 তুই লাথি খাওয়ারই যোগ্য
───────────────
» 🧚‍♀️ ‿𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          body: successMsg,
          attachment: res.data
        },
        threadID,
        messageID
      );

    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐀𝐑𝐈𝐘𝐀𝐍-𝐒𝐀𝐁𝐁𝐈𝐑 👑
───────────────
» 💥 ছবি লোড করতে 
» 🕵️ সমস্যা হয়েছে
───────────────
» 🧚‍♀️ ‿𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};

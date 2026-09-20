const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const config = {
  name: "ai",
  aliases: ["ask", "gpt"],
  version: "2.0.0",
  role: 0,
  hasPermssion: 0,
  author: LOCKED_AUTHOR,
  credits: LOCKED_AUTHOR,
  description: "AI এর সাথে আনলিমিটেড রিপ্লাইতে কথা বলুন",
  category: "AI",
  commandCategory: "AI",
  usages: "ai <আপনার প্রশ্ন>",
  guide: { en: "ai <question>" },
  countDown: 3,
  cooldowns: 3
};

function saveReplyState(messageID, senderID) {
  const data = {
    name: config.name,
    commandName: config.name,
    messageID: messageID,
    author: senderID
  };

  if (global.client && global.client.handleReply) {
    if (Array.isArray(global.client.handleReply)) {
      global.client.handleReply.push(data);
    } else if (typeof global.client.handleReply.set === "function") {
      global.client.handleReply.set(messageID, data);
    }
  }

  if (global.GoatBot && global.GoatBot.onReply) {
    if (typeof global.GoatBot.onReply.set === "function") {
      global.GoatBot.onReply.set(messageID, data);
    } else if (Array.isArray(global.GoatBot.onReply)) {
      global.GoatBot.onReply.push(data);
    }
  }
}

async function processAIResponse(api, event, promptText) {
  const { threadID, messageID, senderID } = event;

  try {
    api.setMessageReaction("⏳", messageID, () => {}, true);
  } catch (_) {}

  try {
    const formattedPrompt = "Answer in a very short, funny, witty, and humorous tone in Bengali language: " + promptText;
    const res = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(formattedPrompt)}`);
    const answer = res.data || "আরে ধুর! কিছু মাথায় আইলো না।";

    try {
      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (_) {}

    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📝 𝐀𝐍𝐒𝐖𝐄𝐑 :
${answer}
───────────────`,
      threadID,
      (err, info) => {
        if (info && info.messageID) {
          saveReplyState(info.messageID, senderID);
        }
      },
      messageID
    );

  } catch (err) {
    try {
      api.setMessageReaction("❌", messageID, () => {}, true);
    } catch (_) {}

    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 
» 🫣 𝐀𝐍𝐒𝐖𝐄𝐑 𝐐𝐔𝐄𝐒𝐓𝐈𝐎𝐍!
───────────────`,
      threadID,
      messageID
    );
  }
}

async function handleCommand({ api, event, args }) {
  if (config.author !== LOCKED_AUTHOR) {
    config.author = LOCKED_AUTHOR;
  }

  const { threadID, messageID } = event;
  const prompt = args.join(" ").trim();

  if (!prompt) {
    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ যেকোনো একটি প্রশ্ন লিখুন!
» 🔰 ai বাংলাদেশের রাজধানী কোথায়?
───────────────`,
      threadID,
      messageID
    );
  }

  return await processAIResponse(api, event, prompt);
}

async function handleReply({ api, event }) {
  if (config.author !== LOCKED_AUTHOR) {
    config.author = LOCKED_AUTHOR;
  }

  const { body } = event;
  if (!body) return;

  return await processAIResponse(api, event, body);
}

module.exports = {
  config: config,
  onStart: handleCommand,
  run: handleCommand,
  handleReply: handleReply,
  onReply: handleReply
};

module.exports.config = config;
module.exports.onStart = handleCommand;
module.exports.run = handleCommand;
module.exports.handleReply = handleReply;
module.exports.onReply = handleReply;

const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const config = {
  name: "ai",
  aliases: ["ask", "gpt"],
  version: "3.0.0",
  role: 0,
  hasPermssion: 0,
  author: LOCKED_AUTHOR,
  credits: LOCKED_AUTHOR,
  description: "মানুষের মতো চ্যাটিং ও দ্রুত উত্তর দেওয়ার AI বট",
  category: "AI",
  commandCategory: "AI",
  usages: "ai <আপনার প্রশ্ন>",
  guide: { en: "ai <question>" },
  countDown: 2,
  cooldowns: 2
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
    const systemPrompt = `You are a real Bengali human friend chatting on Facebook Messenger. Reply very fast in 1 short line (max 2 short lines).
Rules:
1. If the user asks casual daily questions (e.g. 'খাইছো?', 'কেমন আছো?', 'কী করো?'), answer naturally like a real human friend with sweet, funny, or romantic tone.
2. If the user asks general knowledge or factual questions (e.g. 'বাংলাদেশের রাজধানী কী?'), give the accurate factual answer briefly.
3. Use relevant cute, funny, or romantic emojis based on context.
4. Always respond in natural Bengali language.
User asked: `;

    const formattedPrompt = systemPrompt + promptText;
    const res = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(formattedPrompt)}`, {
      timeout: 15000
    });

    const answer = res.data || "আরে সোনা, কিছু তো বলো! 😋";

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
» ⚠️ যেকোনো একটি প্রশ্ন বা কথা লিখুন!
» 🔰 ai খাইছো?
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

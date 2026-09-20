const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const config = {
  name: "aicode",
  aliases: ["makecode", "এআইকোড"],
  version: "5.0.0",
  role: 2,
  hasPermssion: 2,
  author: LOCKED_AUTHOR,
  credits: LOCKED_AUTHOR,
  description: "এডমিনদের জন্য AI ফাইল জেনারেটর ও কাস্টম স্ট্রাকচার মেমোরি বট",
  category: "Admin",
  commandCategory: "Admin",
  usages: "coder <বিবরণ / স্ট্রাকচার সেভ / ভুল কোড>",
  guide: { en: "coder <prompt or broken code>" },
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

async function uploadToPaste(codeText) {
  try {
    const params = new URLSearchParams();
    params.append("content", codeText);
    params.append("format", "url");

    const res = await axios.post("https://dpaste.org/api/", params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 15000
    });
    return res.data ? res.data.trim() : null;
  } catch (_) {
    return null;
  }
}

function cleanCodeOutput(rawText) {
  let cleaned = rawText
    .replace(/```javascript/gi, "")
    .replace(/```js/gi, "")
    .replace(/```/g, "")
    .trim();
  return cleaned;
}

async function processAIResponse(api, event, promptText) {
  const { threadID, messageID, senderID } = event;

  try {
    api.setMessageReaction("⏳", messageID, () => {}, true);
  } catch (_) {}

  if (promptText.includes("মনে রাখো") || promptText.includes("আমার বটের ফাইল")) {
    global.savedBotTemplate = promptText;
    try {
      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (_) {}
    return api.sendMessage(
      "✅ আপনার বটের ফাইল স্ট্রাকচার সফলভাবে মেমোরিতে সেভ করা হয়েছে! পরবর্তী সব ফাইল এই স্ট্রাকচারেই তৈরি করা হবে।",
      threadID,
      messageID
    );
  }

  try {
    let customTemplateNotice = "";
    if (global.savedBotTemplate) {
      customTemplateNotice = `\nSTRICT TEMPLATE STRUCTURE TO FOLLOW:\nUse this sample structure as a strict blueprint for exports, parameters, and layout:\n${global.savedBotTemplate}\n`;
    }

    const systemPrompt = `You are an expert Messenger Bot File Developer (supporting Mirai, GoatBot, Capi).
CRITICAL RULES:
1. OUTPUT ONLY THE RAW JAVASCRIPT CODE. Do NOT output markdown ticks like \`\`\`javascript or \`\`\`. Do NOT include any conversation, greetings, intro, or outro.
2. The code MUST be a fully functional file. Author MUST be set to '${LOCKED_AUTHOR}'.
3. Config must contain: name, aliases, version, role, hasPermssion, author, credits, description, category, commandCategory, usages, guide, countDown, cooldowns.
4. All sendMessage outputs inside the generated code MUST strictly follow this exact design layout:
   » 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
   ───────────────
   <Message Content>
   ───────────────
   » 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧
${customTemplateNotice}
User Request / Code to Fix: `;

    const formattedPrompt = systemPrompt + promptText;
    const res = await axios.get(`[https://text.pollinations.ai/$](https://text.pollinations.ai/$){encodeURIComponent(formattedPrompt)}`, {
      timeout: 30000
    });

    let rawOutput = res.data ? res.data.trim() : "";
    let finalCode = cleanCodeOutput(rawOutput);

    try {
      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (_) {}

    if (finalCode.length > 1800) {
      const pasteUrl = await uploadToPaste(finalCode);
      if (pasteUrl) {
        return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📦 𝐅𝐈𝐋𝐄 𝐈𝐒 𝐓𝐎𝐎 𝐋𝐀𝐑𝐆𝐄!
» 🔗 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 & 𝐂𝐨𝐩𝐲 𝐅𝐢𝐥𝐞:
${pasteUrl}/raw
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID,
          (err, info) => {
            if (info && info.messageID) {
              saveReplyState(info.messageID, senderID);
            }
          },
          messageID
        );
      }
    }

    return api.sendMessage(
      finalCode,
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
      "❌ কোড ফাইল তৈরি বা ফিক্স করতে সমস্যা হয়েছে!",
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
      "⚠️ আপনি কিসের কোড বানাতে চান বা কোন স্ট্রাকচার সেভ করতে চান তা লিখুন!",
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

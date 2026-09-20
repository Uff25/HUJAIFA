const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const API_BASE = "https://xrahat-gen.vercel.app";
const GENERATE_ENDPOINT = `${API_BASE}/api/generate`;

module.exports.config = {
  name: "aiv", 
  aliases: ["aivideo"],
  version: "1.0.0",
  hasPermssion: 2,
  author: LOCKED_AUTHOR,
  credits: LOCKED_AUTHOR,  
  description: "ছবিতে রিপ্লাই দিয়ে prompt লিখে AI ভিডিও generate করে",
  commandCategory: "AI",
  usages: "[একটা ছবিতে reply দিয়ে] aiv <prompt>",
  cooldowns: 10
};

module.exports.onStart = async function ({ api, event, args }) {
  if (module.exports.config.author !== LOCKED_AUTHOR) {
    module.exports.config.author = LOCKED_AUTHOR;
  }

  const { threadID, messageID, messageReply } = event;

  if (
    !messageReply ||
    !Array.isArray(messageReply.attachments) ||
    messageReply.attachments.length === 0
  ) {
    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ একটা ছবিতে reply দিয়ে লিখুন: 
» aiv prompt
» 🔰 aiv dancing in a neon city
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );
  }

  const attachment = messageReply.attachments.find(
    (a) =>
      a.type === "photo" ||
      a.type === "sticker" ||
      a.type === "animated_image"
  );

  if (
    !attachment ||
    !(
      attachment.url ||
      attachment.previewUrl ||
      attachment.largePreviewUrl
    )
  ) {
    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ শুধু ছবিতে reply দিয়ে 
» 🫣 এই command ব্যবহার করা যাবে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );
  }

  const prompt = (args || []).join(" ").trim();

  if (!prompt) {
    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ Prompt লিখুন। 
» 🔰 aiv dancing in a neon city
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );
  }

  const imageUrl =
    attachment.url ||
    attachment.previewUrl ||
    attachment.largePreviewUrl;

  let waitMessageID = null;
  let tempFilePath = null;

  try {

    waitMessageID = await new Promise((resolve) => {
      api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐛𝐚𝐫𝐚...
» 🎥 𝐕𝐢𝐝𝐞𝐨 𝐢𝐬 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        (err, info) => {
          resolve(info ? info.messageID : null);
        },
        messageID
      );
    });

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 670000
    });

    const imageBuffer = Buffer.from(imageResponse.data);

    const form = new FormData();

    form.append("image", imageBuffer, {
      filename: "input.jpg",
      contentType: "image/jpeg"
    });

    form.append("prompt", prompt);
    form.append("mode", "image");

    const genResponse = await axios.post(
      GENERATE_ENDPOINT,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 2780000,
        responseType: "arraybuffer",
        validateStatus: () => true
      }
    );

    const contentType =
      genResponse.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      let errJson = null;

      try {
        errJson = JSON.parse(
          Buffer.from(genResponse.data).toString("utf-8")
        );
      } catch (_) {}

      throw new Error(
        (errJson && errJson.Result) ||
        "Generation failed"
      );
    }

    if (
      genResponse.status < 200 ||
      genResponse.status >= 300 ||
      !contentType.startsWith("video/")
    ) {
      throw new Error(
        "Unexpected response from generate API"
      );
    }

    const ext =
      (contentType.split("/")[1] || "mp4")
        .split(";")[0]
        .trim();

    const videoBuffer =
      Buffer.from(genResponse.data);

    tempFilePath = path.join(
      os.tmpdir(),
      `gen_${Date.now()}_${Math.floor(
        Math.random() * 1e6
      )}.${ext}`
    );

    fs.writeFileSync(
      tempFilePath,
      videoBuffer
    );

    await new Promise((resolve, reject) => {
      api.sendMessage(
        {
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝐀𝐈 𝐕𝐈𝐃𝐄𝐎 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: fs.createReadStream(tempFilePath)
        },
        threadID,
        (err) =>
          err
            ? reject(err)
            : resolve(),
        messageID
      );
    });

    if (waitMessageID) {
      try {
        api.unsendMessage(waitMessageID);
      } catch (_) {}
    }

  } catch (error) {

    console.error(
      "[aiv.js] error:",
      error?.response?.data ||
      error.message ||
      error
    );

    api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 
» 🤩 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄 𝐕𝐈𝐃𝐄𝐎!
» ⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );

  } finally {

    if (tempFilePath) {
      fs.unlink(
        tempFilePath,
        () => {}
      );
    }
  }
};

const fs = require("fs-extra");
const path = __dirname + "/cache/autoseen.json";

const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ status: true }, null, 2));
}

function toBoldStyle(text) {
  if (!text) return "";
  const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars   = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
  
  return text.toString().split("").map(char => {
    const index = normalChars.indexOf(char);
    return index !== -1 ? boldChars.substring(index * 2, (index * 2) + 2) : char;
  }).join("");
}

module.exports = {
  config: {
    name: "autoseen",
    version: "𝟐.𝟎",
    author: LOCKED_AUTHOR,
    countDown: 0,
    role: 0,
    shortDescription: "স্বয়ংক্রিয়ভাবে seen সিস্টেম",
    longDescription: "বট স্বয়ংক্রিয়ভাবে সকল নতুন মেসেজ seen করবে।",
    category: "𝐬𝐲𝐬𝐭𝐞𝐦"
  },

  onStart: async function () {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      console.log("🚫 𝐅𝐈𝐋𝐄 𝐋𝐎𝐂𝐊𝐄𝐃: 𝐀𝐮𝐭𝐡𝐨𝐫 𝐜𝐡𝐚𝐧𝐠𝐞𝐝!");
      return;
    }

    fs.writeFileSync(path, JSON.stringify({ status: true }, null, 2));
  },

  onChat: async function ({ event, api }) {
    try {
      if (module.exports.config.author !== LOCKED_AUTHOR) {
        console.log("🚫 𝐅𝐈𝐋𝐄 𝐋𝐎𝐂𝐊𝐄𝐃: 𝐀𝐮𝐭𝐡𝐨𝐫 𝐜𝐡𝐚𝐧𝐠𝐞𝐝!");
        return;
      }

      api.markAsReadAll();
    } catch (e) {
      console.error(e);
    }
  },
};

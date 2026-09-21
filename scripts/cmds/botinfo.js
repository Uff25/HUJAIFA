const { commands } = global.GoatBot;
const axios = require("axios");
const moment = require("moment-timezone");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function toBold(text) {
  if (text === undefined || text === null) return "";
  return String(text).replace(/[A-Za-z0-9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + (code - 48));
    return char;
  });
}

module.exports = {
  config: {
    name: "botinfo",
    aliases: ["botinf", "infobot", "binfo"],
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: toBold("Bot information")
    },
    longDescription: {
      en: toBold("Get bot and system information")
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, api, threadsData }) {
    try {
      const timeStart = Date.now();

      const threadData = await threadsData.get(event.threadID) || {};
      const ping = Date.now() - timeStart;

      const now = moment().tz("Asia/Dhaka");
      const date = now.format("MMMM DD YYYY");
      const time = now.format("h:mm:ss A");

      const boxPrefix = global.utils.getPrefix(event.threadID);

      const uptime = process.uptime();
      const botUptime = formatMilliseconds(uptime * 1000);

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();

      const diskUsage = await getDiskUsage();

      const systemInfo = {
        os: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        cpu: `${os.cpus()[0].model} (${os.cpus().length} cores)`,
        botUptime,
        serverUptime: formatUptime(os.uptime())
      };

      let speed = "N/A";

      try {
        const FastSpeedtest = require("fast-speedtest-api");

        const speedTest = new FastSpeedtest({
          token: "fast",
          verbose: false,
          timeout: 10000,
          https: true,
          urlCount: 5,
          bufferSize: 8,
          unit: FastSpeedtest.UNITS.Mbps
        });

        speed = await speedTest.getSpeed();
        speed = Number(speed).toFixed(2);
      }
      catch (e) {
        speed = "N/A";
      }

      const info = {
        name: global.GoatBot.config.nickNameBot || "GoatBot",
        prefix: global.GoatBot.config.prefix,
        boxPrefix,
        threadName: threadData.threadName || "Unknown Group"
      };

      let attachment;

      try {
        const { data } = await axios.get(
          "https://api.waifu.pics/sfw/waifu"
        );

        attachment = await global.utils.getStreamFromURL(data.url);
      }
      catch (e) {
        attachment = null;
      }

      const rawText = `
━━━━━━━━━━━━━━━━
𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍
━━━━━━━━━━━━━━━━

☂ | 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: 
☂ | ${toBold(info.name)}
☂ | 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗: ${toBold(info.prefix)}
☂ | 𝐁𝐎𝐗 𝐏𝐑𝐄𝐅𝐈𝐗: ${toBold(info.boxPrefix)}
☂ | 𝐁𝐎𝐓 𝐏𝐈𝐍𝐆: ${toBold(ping)}𝐦𝐬
☂ | 𝐁𝐎𝐓 𝐔𝐏𝐓𝐈𝐌𝐄: ${toBold(systemInfo.botUptime)}
☂ | 𝐓𝐎𝐓𝐀𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒: 
☂ | 👏 ${toBold(commands.size)} 👈
☂ | 𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄: 
☂ | ${toBold(info.threadName)}

━━━━━━━━━━━━━━━━━
𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍
━━━━━━━━━━━━━━━━━━

☂ | 𝐎𝐒: 
☂ | ${toBold(systemInfo.os)}
☂ | 𝐀𝐑𝐂𝐇: ${toBold(systemInfo.arch)}
☂ | 𝐂𝐏𝐔: 
☂ | ${toBold(systemInfo.cpu)}
☂ | 𝐓𝐈𝐌𝐄: ${toBold(time)}
☂ | 𝐃𝐀𝐓𝐄: ${toBold(date)}
☂ | 𝐒𝐏𝐄𝐄𝐃: ${toBold(speed)} 𝐌𝐛𝐩𝐬
☂ | 𝐒𝐄𝐑𝐕𝐄𝐑 𝐔𝐏𝐓𝐈𝐌𝐄: 
☂ | ${toBold(systemInfo.serverUptime)}
☂ | 𝐑𝐀𝐌 𝐔𝐒𝐀𝐆𝐄: ${toBold(prettyBytes(totalMemory - freeMemory))}
☂ | 𝐓𝐎𝐓𝐀𝐋 𝐑𝐀𝐌: ${toBold(prettyBytes(totalMemory))}
☂ | 𝐃𝐈𝐒𝐊 𝐔𝐒𝐄𝐃: ${toBold(prettyBytes(diskUsage.used))}
☂ | 𝐃𝐈𝐒𝐊 𝐓𝐎𝐓𝐀𝐋: ${toBold(prettyBytes(diskUsage.total))}

━━━━━━━━━━━━━━━━━━
👑 | 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 
 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━━━━
`;

      await message.reply({
        body: toBold(rawText),
        attachment
      });

    }
    catch (err) {
      console.log(err);
      message.reply(toBold(`❌ Error:\n${err.message}`));
    }
  }
};

async function getDiskUsage() {
  try {
    const { stdout } = await exec("df -k /");

    const parts = stdout
      .split("\n")[1]
      .split(/\s+/)
      .filter(Boolean);

    return {
      total: parseInt(parts[1]) * 1024,
      used: parseInt(parts[2]) * 1024
    };
  }
  catch (e) {
    return {
      total: 0,
      used: 0
    };
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}D ${hours}H ${minutes}M ${secs}S`;
}

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}H ${minutes % 60}M ${seconds % 60}S`;
}

function prettyBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
}

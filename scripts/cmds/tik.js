const axios = require("axios");

module.exports = {
  config: {
    name: "tik",
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "TikTok Pro Search",
    longDescription: "Auto region detect + trending + stats",
    category: "media",
    guide: "{pn} keyword"
  },

  onStart: async function ({ message, args }) {

    const query = args.join(" ");
    if (!query) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗣𝗟𝗘𝗔𝗦𝗘 𝗣𝗥𝗢𝗩𝗜𝗗𝗘
» ❤️ 𝗔 𝗦𝗘𝗔𝗥𝗖𝗛 𝗞𝗘𝗬𝗪𝗢𝗥𝗗
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }

    try {

      let region = "US";
      try {
        const geo = await axios.get("http://ip-api.com/json/");
        if (geo.data?.countryCode) {
          region = geo.data.countryCode;
        }
      } catch {}

      const api = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=10&cursor=0&region=${region}`;
      const res = await axios.get(api);

      if (!res.data?.data?.videos?.length) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗡𝗢 𝗩𝗜𝗗𝗘𝗢 𝗙𝗢𝗨𝗡𝗗
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }

      const videos = res.data.data.videos.sort((a, b) => b.digg_count - a.digg_count);
      const selected = videos[Math.floor(Math.random() * Math.min(5, videos.length))];

      const videoUrl = selected.play;
      const caption = selected.title || "No caption";
      const likes = selected.digg_count || 0;
      const comments = selected.comment_count || 0;
      const views = selected.play_count || 0;

      return message.reply({
        body:
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🌍 𝗥𝗘𝗚𝗜𝗢𝗡: ${region}
» 🎬 𝗦𝗘𝗔𝗥𝗖𝗛: ${query}
» ❤️ 𝗟𝗜𝗞𝗘𝗦: ${likes}
» 💬 𝗖𝗢𝗠𝗠𝗘𝗡𝗧𝗦: ${comments}
» 👀 𝗩𝗜𝗘𝗪𝗦: ${views}
» 📝 𝗖𝗔𝗣𝗧𝗜𝗢𝗡: ${caption}
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        attachment: await global.utils.getStreamFromURL(videoUrl)
      });

    } catch (err) {
      console.error(err);
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗣𝗥𝗢 𝗘𝗥𝗥𝗢𝗥
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};

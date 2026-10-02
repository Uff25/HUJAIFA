const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const GIFEncoder = require("gifencoder");

const LOCKED_AUTHOR_1 = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const LOCKED_AUTHOR_2 = "SIYAM-HASAN";

function cleanText(text) {
	if (!text) return "";
	return text
		.normalize("NFKC")
		.replace(/[^\x20-\x7E\u0980-\u09FF]/g, "")
		.trim();
}

function drawRoundRect(ctx, x, y, width, height, radius) {
	if (typeof radius === 'number') {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
	} else {
		radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
}

function drawPolygon(ctx, x, y, radius, sides) {
	ctx.beginPath();
	for (let i = 0; i < sides; i++) {
		const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
		const px = x + radius * Math.cos(angle);
		const py = y + radius * Math.sin(angle);
		if (i === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.closePath();
}

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

async function runDesign1({ api, event, message, usersData }) {
	const waitMsg = await message.reply("✄------------");

	const cacheDir = path.join(__dirname, "cache");
	if (!fs.existsSync(cacheDir)) {
		fs.mkdirSync(cacheDir, { recursive: true });
	}

	let targetID = event.senderID;
	if (event.type === "message_reply" && event.messageReply) {
		targetID = event.messageReply.senderID;
	} else if (event.mentions && Object.keys(event.mentions).length > 0) {
		targetID = Object.keys(event.mentions)[0];
	}

	const imgPath = path.join(cacheDir, `uid_${targetID}_${Date.now()}.png`);

	try {
		let rawUserName = "";
		try {
			if (usersData && typeof usersData.get === "function") {
				const uData = await usersData.get(targetID);
				if (uData && uData.name) rawUserName = uData.name;
			}
			if (!rawUserName && api && typeof api.getUserInfo === "function") {
				const info = await api.getUserInfo(targetID);
				if (info && info[targetID]) rawUserName = info[targetID].name;
			}
		} catch (e) {
			rawUserName = "FACEBOOK USER";
		}

		const displayUserName = rawUserName || "FACEBOOK USER";
		const cleanUserName = cleanText(displayUserName).toUpperCase() || "FACEBOOK USER";
		const ownerName = cleanText(LOCKED_AUTHOR_1) || "SIYAM HASAN";
		const avatarLink = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

		const width = 850;
		const height = 420;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "#020204";
		ctx.fillRect(0, 0, width, height);

		ctx.save();
		const orbCyan = ctx.createRadialGradient(180, 100, 10, 180, 100, 320);
		orbCyan.addColorStop(0, "rgba(0, 245, 212, 0.25)");
		orbCyan.addColorStop(0.5, "rgba(0, 245, 212, 0.08)");
		orbCyan.addColorStop(1, "transparent");
		ctx.fillStyle = orbCyan;
		ctx.fillRect(0, 0, width, height);

		const orbMagenta = ctx.createRadialGradient(720, 320, 10, 720, 320, 350);
		orbMagenta.addColorStop(0, "rgba(255, 0, 127, 0.22)");
		orbMagenta.addColorStop(0.5, "rgba(255, 0, 127, 0.07)");
		orbMagenta.addColorStop(1, "transparent");
		ctx.fillStyle = orbMagenta;
		ctx.fillRect(0, 0, width, height);

		const orbPurple = ctx.createRadialGradient(425, 380, 10, 425, 380, 280);
		orbPurple.addColorStop(0, "rgba(112, 0, 255, 0.20)");
		orbPurple.addColorStop(1, "transparent");
		ctx.fillStyle = orbPurple;
		ctx.fillRect(0, 0, width, height);
		ctx.restore();

		ctx.save();
		ctx.strokeStyle = "rgba(0, 245, 212, 0.04)";
		ctx.lineWidth = 1;
		for (let x = 0; x < width; x += 30) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}
		for (let y = 0; y < height; y += 30) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}
		ctx.restore();

		ctx.save();
		drawRoundRect(ctx, 25, 25, width - 50, height - 50, 22);
		ctx.fillStyle = "rgba(8, 10, 18, 0.92)";
		ctx.fill();

		ctx.shadowColor = "#00f5d4";
		ctx.shadowBlur = 18;
		ctx.strokeStyle = "#00f5d4";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.shadowColor = "#ff007f";
		ctx.shadowBlur = 12;
		ctx.strokeStyle = "rgba(255, 0, 127, 0.6)";
		ctx.lineWidth = 1.5;
		drawRoundRect(ctx, 21, 21, width - 42, height - 42, 24);
		ctx.stroke();
		ctx.restore();

		const hexX = 160;
		const hexY = 210;
		const hexRadius = 110;

		ctx.save();
		drawPolygon(ctx, hexX, hexY, hexRadius + 8, 6);
		const hexGrad = ctx.createLinearGradient(hexX - hexRadius, hexY - hexRadius, hexX + hexRadius, hexY + hexRadius);
		hexGrad.addColorStop(0, "#00f5d4");
		hexGrad.addColorStop(0.5, "#7000ff");
		hexGrad.addColorStop(1, "#ff007f");
		ctx.strokeStyle = hexGrad;
		ctx.lineWidth = 6;
		ctx.shadowColor = "#00f5d4";
		ctx.shadowBlur = 22;
		ctx.stroke();
		ctx.restore();

		try {
			const avatarImg = await loadImage(avatarLink);
			ctx.save();
			drawPolygon(ctx, hexX, hexY, hexRadius, 6);
			ctx.clip();
			ctx.drawImage(avatarImg, hexX - hexRadius, hexY - hexRadius, hexRadius * 2, hexRadius * 2);
			ctx.restore();
		} catch (e) {
			ctx.save();
			drawPolygon(ctx, hexX, hexY, hexRadius, 6);
			ctx.fillStyle = "#12182e";
			ctx.fill();
			ctx.fillStyle = "#00f5d4";
			ctx.font = "bold 70px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(cleanUserName.charAt(0) || "U", hexX, hexY + 24);
			ctx.restore();
		}

		const contentX = 330;

		ctx.save();
		ctx.font = "bold 15px sans-serif";
		ctx.fillStyle = "#8e9bbd";
		ctx.fillText("USER NAME", contentX, 85);

		ctx.font = "bold 28px sans-serif";
		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "#ffffff";
		ctx.shadowBlur = 8;
		ctx.fillText(cleanUserName, contentX, 122);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		ctx.beginPath();
		ctx.moveTo(contentX, 145);
		ctx.lineTo(width - 60, 145);
		ctx.stroke();

		ctx.font = "bold 15px sans-serif";
		ctx.fillStyle = "#8e9bbd";
		ctx.fillText("USER ID", contentX, 185);

		ctx.font = "bold 32px sans-serif";
		ctx.fillStyle = "#00f5d4";
		ctx.shadowColor = "#00f5d4";
		ctx.shadowBlur = 14;
		ctx.fillText(targetID, contentX, 225);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		ctx.beginPath();
		ctx.moveTo(contentX, 250);
		ctx.lineTo(width - 60, 250);
		ctx.stroke();

		ctx.font = "bold 15px sans-serif";
		ctx.fillStyle = "#8e9bbd";
		ctx.fillText("SYSTEM OWNER", contentX, 290);

		ctx.font = "bold 24px sans-serif";
		ctx.fillStyle = "#ffee32";
		ctx.shadowColor = "#ffee32";
		ctx.shadowBlur = 10;
		ctx.fillText(ownerName, contentX, 328);
		ctx.restore();

		const buffer = canvas.toBuffer("image/png");
		await fs.writeFile(imgPath, buffer);

		if (waitMsg && waitMsg.messageID) {
			if (typeof message.unsend === "function") {
				await message.unsend(waitMsg.messageID);
			} else if (api && typeof api.unsendMessage === "function") {
				api.unsendMessage(waitMsg.messageID);
			}
		}

		const msgStream = fs.createReadStream(imgPath);

		return await message.reply({
			body: `${targetID}`,
			attachment: msgStream
		});

	} catch (err) {
		console.error("UID Command Error:", err);
		if (waitMsg && waitMsg.messageID) {
			if (typeof message.unsend === "function") {
				await message.unsend(waitMsg.messageID);
			} else if (api && typeof api.unsendMessage === "function") {
				api.unsendMessage(waitMsg.messageID);
			}
		}
	} finally {
		setTimeout(() => {
			if (fs.existsSync(imgPath)) {
				fs.unlinkSync(imgPath);
			}
		}, 5000);
	}
}

async function runDesign2({ api, event }) {
	const { threadID, messageID, senderID, mentions, type, messageReply } = event;

	try {
		let targetID = senderID;

		if (mentions && Object.keys(mentions).length > 0) {
			targetID = Object.keys(mentions)[0];
		} else if (type === "message_reply" && messageReply?.senderID) {
			targetID = messageReply.senderID;
		}

		let userName = "Unknown User";

		try {
			const userInfo = await api.getUserInfo(targetID);
			if (userInfo && userInfo[targetID] && userInfo[targetID].name) {
				userName = userInfo[targetID].name;
			}
		} catch (e) {
			try {
				const info = await api.getUserInfo([targetID]);
				if (info && info[targetID] && info[targetID].name) {
					userName = info[targetID].name;
				}
			} catch (err) {}
		}

		const width = 820;
		const height = 480;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		const bg = ctx.createLinearGradient(0, 0, width, height);
		bg.addColorStop(0, "#1c0a16");
		bg.addColorStop(0.3, "#2d1230");
		bg.addColorStop(0.6, "#3b1540");
		bg.addColorStop(1, "#1a0b1c");
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, width, height);

		const light1 = ctx.createRadialGradient(100, 60, 10, 120, 120, 300);
		light1.addColorStop(0, "rgba(251, 113, 133, 0.35)");
		light1.addColorStop(1, "rgba(251, 113, 133, 0)");
		ctx.fillStyle = light1;
		ctx.fillRect(0, 0, width, height);

		const light2 = ctx.createRadialGradient(720, 80, 20, 680, 160, 340);
		light2.addColorStop(0, "rgba(192, 132, 252, 0.3)");
		light2.addColorStop(1, "rgba(192, 132, 252, 0)");
		ctx.fillStyle = light2;
		ctx.fillRect(0, 0, width, height);

		const light3 = ctx.createRadialGradient(400, 450, 30, 400, 380, 280);
		light3.addColorStop(0, "rgba(244, 114, 182, 0.25)");
		light3.addColorStop(1, "rgba(244, 114, 182, 0)");
		ctx.fillStyle = light3;
		ctx.fillRect(0, 0, width, height);

		const light4 = ctx.createRadialGradient(200, 400, 20, 180, 350, 200);
		light4.addColorStop(0, "rgba(253, 164, 175, 0.2)");
		light4.addColorStop(1, "rgba(253, 164, 175, 0)");
		ctx.fillStyle = light4;
		ctx.fillRect(0, 0, width, height);

		ctx.save();
		ctx.shadowColor = "rgba(244, 114, 182, 0.4)";
		ctx.shadowBlur = 32;
		roundRect(ctx, 20, 20, 780, 440, 26);
		ctx.fillStyle = "rgba(25, 12, 32, 0.9)";
		ctx.fill();
		ctx.restore();

		ctx.strokeStyle = "rgba(251, 113, 133, 0.6)";
		ctx.lineWidth = 3;
		roundRect(ctx, 20, 20, 780, 440, 26);
		ctx.stroke();

		ctx.strokeStyle = "rgba(192, 132, 252, 0.3)";
		ctx.lineWidth = 1.5;
		roundRect(ctx, 32, 32, 756, 416, 20);
		ctx.stroke();

		const headerGrad = ctx.createLinearGradient(45, 40, 775, 40);
		headerGrad.addColorStop(0, "#fb7185");
		headerGrad.addColorStop(0.5, "#e879f9");
		headerGrad.addColorStop(1, "#c084fc");
		ctx.fillStyle = headerGrad;
		roundRect(ctx, 45, 40, 730, 52, 14);
		ctx.fill();

		ctx.font = "bold 28px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.shadowColor = "rgba(0,0,0,0.3)";
		ctx.shadowBlur = 6;
		ctx.fillText("UID", 410, 76);
		ctx.shadowBlur = 0;

		const avatarSize = 175;
		const avatarX = 70;
		const avatarY = 120;

		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 7, 0, Math.PI * 2);
		const ringGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
		ringGrad.addColorStop(0, "#fb7185");
		ringGrad.addColorStop(0.5, "#e879f9");
		ringGrad.addColorStop(1, "#c084fc");
		ctx.strokeStyle = ringGrad;
		ctx.lineWidth = 6;
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		try {
			const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
			const avatar = await loadImage(avatarUrl);
			ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
		} catch (e) {
			ctx.fillStyle = "#4a1d3a";
			ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
			ctx.font = "bold 42px Arial";
			ctx.fillStyle = "#f9a8d4";
			ctx.textAlign = "center";
			ctx.fillText("?", avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 16);
		}
		ctx.restore();

		ctx.fillStyle = "rgba(45, 20, 50, 0.85)";
		roundRect(ctx, 290, 115, 480, 100, 16);
		ctx.fill();

		ctx.fillStyle = "#fb7185";
		ctx.shadowColor = "#fb7185";
		ctx.shadowBlur = 10;
		roundRect(ctx, 290, 115, 8, 100, 6);
		ctx.fill();
		ctx.shadowBlur = 0;

		ctx.font = "bold 15px Arial";
		ctx.fillStyle = "#f9a8d4";
		ctx.textAlign = "left";
		ctx.fillText("USER NAME", 320, 150);

		ctx.font = "bold 27px Arial";
		ctx.fillStyle = "#ffffff";
		const displayName = userName.length > 22 ? userName.slice(0, 22) + "..." : userName;
		ctx.fillText(displayName, 320, 190);

		ctx.fillStyle = "rgba(45, 20, 50, 0.85)";
		roundRect(ctx, 290, 235, 480, 100, 16);
		ctx.fill();

		ctx.fillStyle = "#c084fc";
		ctx.shadowColor = "#c084fc";
		ctx.shadowBlur = 10;
		roundRect(ctx, 290, 235, 8, 100, 6);
		ctx.fill();
		ctx.shadowBlur = 0;

		ctx.font = "bold 15px Arial";
		ctx.fillStyle = "#e9d5ff";
		ctx.fillText("USER ID", 320, 270);

		ctx.font = "bold 26px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(String(targetID), 320, 310);

		ctx.fillStyle = "rgba(50, 20, 55, 0.9)";
		roundRect(ctx, 50, 360, 720, 70, 16);
		ctx.fill();

		const bottomGrad = ctx.createLinearGradient(50, 360, 770, 360);
		bottomGrad.addColorStop(0, "#fb7185");
		bottomGrad.addColorStop(0.5, "#e879f9");
		bottomGrad.addColorStop(1, "#c084fc");
		ctx.fillStyle = bottomGrad;
		ctx.fillRect(50, 360, 720, 5);

		ctx.font = "bold 26px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.shadowColor = "rgba(0,0,0,0.3)";
		ctx.shadowBlur = 5;
		ctx.fillText("Owner : Siyam Hasan", 410, 410);
		ctx.shadowBlur = 0;

		const cachePath = path.join(__dirname, "cache");
		await fs.ensureDir(cachePath);
		const filePath = path.join(cachePath, `uid_${Date.now()}.png`);
		await fs.writeFile(filePath, canvas.toBuffer("image/png"));

		await api.sendMessage({
			body: String(targetID),
			attachment: fs.createReadStream(filePath)
		}, threadID, messageID);

		setTimeout(() => {
			fs.unlink(filePath).catch(() => {});
		}, 30000);

	} catch (err) {
		console.log(err);
		return api.sendMessage("UID card generate korte problem hoise.", threadID, messageID);
	}
}

async function runDesign3({ api, message, event }) {
	let targetID = event.senderID;
	if (event.mentions && Object.keys(event.mentions).length > 0) {
		targetID = Object.keys(event.mentions)[0];
	}

	const loadingMsg = await message.reply("⏳ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗨𝗜 𝗖𝗮𝗿𝗱...");

	let userName = "Facebook User";
	try {
		const userInfo = await api.getUserInfo(targetID);
		if (userInfo[targetID] && userInfo[targetID].name) {
			userName = userInfo[targetID].name;
		}
	} catch (e) {
		userName = "Facebook User";
	}

	const botName = "SIYAM-BOT";
	const ownerName = "SIYAM HASAN";

	const width = 900;
	const height = 550;

	const cacheDir = path.join(__dirname, "cache");
	if (!fs.existsSync(cacheDir)) {
		fs.mkdirSync(cacheDir, { recursive: true });
	}
	const gifPath = path.join(cacheDir, `user_card_${Date.now()}.gif`);

	const encoder = new GIFEncoder(width, height);
	const writeStream = fs.createWriteStream(gifPath);

	encoder.createReadStream().pipe(writeStream);
	encoder.start();
	encoder.setRepeat(0);
	encoder.setDelay(110);
	encoder.setQuality(10);

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=600&width=600&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	let userImg = null;

	try {
		const imgRes = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 6000 });
		userImg = await loadImage(Buffer.from(imgRes.data));
	} catch (e) {
		userImg = null;
	}

	const drawHeart = (x, y, size, color) => {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = 10;
		const topCurveHeight = size * 0.3;
		ctx.moveTo(x, y + topCurveHeight);
		ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
		ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
		ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
		ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	};

	const totalFrames = 12;

	for (let frame = 0; frame < totalFrames; frame++) {
		const bgGrad = ctx.createLinearGradient(0, 0, width, height);
		bgGrad.addColorStop(0, "#2a0845");
		bgGrad.addColorStop(0.5, "#6441a5");
		bgGrad.addColorStop(1, "#200122");
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, width, height);

		const heartColors = ["#ff007f", "#00f0ff", "#ff0055", "#ffd700", "#00ff66"];
		for (let i = 0; i < 25; i++) {
			const hX = (i * 37 + frame * 10) % width;
			const hY = (i * 53 + frame * 5) % height;
			const hSize = 12 + (i % 3) * 6;
			const color = heartColors[(i + frame) % heartColors.length];
			ctx.globalAlpha = 0.35;
			drawHeart(hX, hY, hSize, color);
		}
		ctx.globalAlpha = 1.0;

		const pad = 20;
		const isRed = frame % 2 === 0;
		const borderPrimary = isRed ? "#ff007f" : "#00f0ff";
		const borderSecondary = isRed ? "#00f0ff" : "#ff007f";

		ctx.strokeStyle = borderPrimary;
		ctx.shadowColor = borderPrimary;
		ctx.shadowBlur = 18;
		ctx.lineWidth = 4;
		ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

		ctx.strokeStyle = borderSecondary;
		ctx.shadowColor = borderSecondary;
		ctx.shadowBlur = 12;
		ctx.lineWidth = 2;
		ctx.strokeRect(pad + 8, pad + 8, width - (pad + 8) * 2, height - (pad + 8) * 2);
		ctx.shadowBlur = 0;

		const lightColors = ["#ff0000", "#00f0ff", "#00ff66", "#ffd700"];
		const l1 = lightColors[frame % lightColors.length];
		const l2 = lightColors[(frame + 2) % lightColors.length];

		ctx.fillStyle = l1;
		ctx.shadowColor = l1;
		ctx.shadowBlur = 15;
		ctx.beginPath(); ctx.arc(pad + 15, pad + 15, 8, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(width - pad - 15, height - pad - 15, 8, 0, Math.PI * 2); ctx.fill();

		ctx.fillStyle = l2;
		ctx.shadowColor = l2;
		ctx.shadowBlur = 15;
		ctx.beginPath(); ctx.arc(width - pad - 15, pad + 15, 8, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(pad + 15, height - pad - 15, 8, 0, Math.PI * 2); ctx.fill();
		ctx.shadowBlur = 0;

		const cx = 170;
		const cy = 230;
		const radius = 100;

		if (userImg) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(userImg, cx - radius, cy - radius, radius * 2, radius * 2);
			ctx.restore();
		} else {
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.fillStyle = "#ff007f";
			ctx.fill();
		}

		const ringGlow = lightColors[frame % lightColors.length];
		ctx.beginPath();
		ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
		ctx.strokeStyle = ringGlow;
		ctx.shadowColor = ringGlow;
		ctx.shadowBlur = 25;
		ctx.lineWidth = 6;
		ctx.stroke();
		ctx.shadowBlur = 0;

		const textX = 310;

		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "#ffffff";
		ctx.shadowBlur = 8;
		ctx.font = "bold 38px Arial, sans-serif";
		ctx.fillText(userName, textX, 170);

		ctx.fillStyle = "#e0e0ff";
		ctx.shadowBlur = 0;
		ctx.font = "bold 20px Arial, sans-serif";
		ctx.fillText("USER ID:", textX, 225);

		const uidGlow = lightColors[(frame + 1) % lightColors.length];
		ctx.fillStyle = uidGlow;
		ctx.shadowColor = uidGlow;
		ctx.shadowBlur = 12;
		ctx.font = "bold 28px Arial, sans-serif";
		ctx.fillText(targetID, textX + 110, 227);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(textX, 260);
		ctx.lineTo(width - 80, 260);
		ctx.stroke();

		ctx.fillStyle = "#e0e0ff";
		ctx.font = "bold 20px Arial, sans-serif";
		ctx.fillText("BOT NAME:", textX, 310);

		ctx.fillStyle = "#00ff66";
		ctx.shadowColor = "#00ff66";
		ctx.shadowBlur = 8;
		ctx.font = "bold 22px Arial, sans-serif";
		ctx.fillText(botName, textX + 130, 310);

		ctx.fillStyle = "#e0e0ff";
		ctx.shadowBlur = 0;
		ctx.font = "bold 20px Arial, sans-serif";
		ctx.fillText("OWNER:", textX, 355);

		ctx.fillStyle = "#ffd700";
		ctx.shadowColor = "#ffd700";
		ctx.shadowBlur = 8;
		ctx.font = "bold 22px Arial, sans-serif";
		ctx.fillText(ownerName, textX + 100, 355);
		ctx.shadowBlur = 0;

		ctx.fillStyle = "#00f0ff";
		ctx.shadowColor = "#00f0ff";
		ctx.shadowBlur = 12;
		ctx.font = "bold 22px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("SYSTEM STATUS: ACTIVE", width / 2, 480);
		ctx.shadowBlur = 0;
		ctx.textAlign = "left";

		encoder.addFrame(ctx);
	}

	encoder.finish();

	writeStream.on("finish", async () => {
		if (loadingMsg && loadingMsg.messageID) {
			try {
				await api.unsendMessage(loadingMsg.messageID);
			} catch (err) {}
		}

		return message.reply({
			body: targetID,
			attachment: fs.createReadStream(gifPath)
		}, () => {
			if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
		});
	});
}

const userLastSelection = new Map();

module.exports = {
	config: {
		name: "uid",
		aliases: ["uid", "uid2", "ইউআইডি", "useid"],
		version: "6.0",
		author: LOCKED_AUTHOR_1,
		countDown: 3,
		role: 0,
		description: {
			en: "Get user profile card with randomly selected unique design"
		},
		category: "user",
		guide: {
			en: "{pn}\n{pn} @mention\n{pn} (reply)"
		}
	},

	onStart: async function (params) {
		if (module.exports.config.author !== LOCKED_AUTHOR_1) {
			module.exports.config.author = LOCKED_AUTHOR_1;
		}

		const userID = params.event.senderID;
		const availableDesigns = [1, 2, 3];
		const lastDesign = userLastSelection.get(userID);

		let eligibleDesigns = availableDesigns;
		if (lastDesign !== undefined) {
			eligibleDesigns = availableDesigns.filter(d => d !== lastDesign);
		}

		const selectedDesign = eligibleDesigns[Math.floor(Math.random() * eligibleDesigns.length)];

		userLastSelection.set(userID, selectedDesign);

		if (selectedDesign === 1) {
			await runDesign1(params);
		} else if (selectedDesign === 2) {
			await runDesign2(params);
		} else if (selectedDesign === 3) {
			await runDesign3(params);
		}
	}
};

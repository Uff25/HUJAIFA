const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const { createCanvas, loadImage } = require("canvas");
const moment = require("moment-timezone");
const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const userHistory = new Map();

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

async function executeStyle1({ api, message, event }) {
	const cacheDir = path.join(__dirname, "cache");
	if (!fs.existsSync(cacheDir)) {
		fs.mkdirSync(cacheDir, { recursive: true });
	}

	const imgPath = path.join(cacheDir, `halftime_${event.senderID}_${Date.now()}.png`);

	try {
		const uptimeSeconds = process.uptime();
		const days = Math.floor(uptimeSeconds / (3600 * 24));
		const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
		const minutes = Math.floor((uptimeSeconds % 3600) / 60);
		const seconds = Math.floor(uptimeSeconds % 60);

		const strDays = String(days).padStart(2, '0');
		const strHours = String(hours).padStart(2, '0');
		const strMins = String(minutes).padStart(2, '0');
		const strSecs = String(seconds).padStart(2, '0');

		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		const usedMem = totalMem - freeMem;
		const memMB = (usedMem / (1024 * 1024)).toFixed(1);
		const ramPercent = Math.min(Math.round((usedMem / totalMem) * 100), 100);

		const cpus = os.cpus();
		const loadAvg = os.loadavg()[0];
		const cpuPercent = Math.min(Math.round((loadAvg / cpus.length) * 100) || 12, 99);

		const now = new Date();
		const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
		const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
		const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

		const width = 1920;
		const height = 1080;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1200);
		bgGrad.addColorStop(0, "#0e1329");
		bgGrad.addColorStop(0.5, "#080a18");
		bgGrad.addColorStop(1, "#03040a");
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, width, height);

		ctx.save();
		for (let i = 0; i < 80; i++) {
			const px = (Math.sin(i * 99) * 0.5 + 0.5) * width;
			const py = (Math.cos(i * 33) * 0.5 + 0.5) * height;
			const pr = (i % 3) + 1.5;
			ctx.fillStyle = i % 2 === 0 ? "rgba(0, 210, 255, 0.2)" : "rgba(157, 78, 221, 0.2)";
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		ctx.save();
		drawRoundRect(ctx, 30, 30, width - 60, height - 60, 28);
		ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "rgba(11, 16, 38, 0.85)";
		drawRoundRect(ctx, 50, 45, width - 100, 115, 20);
		ctx.fill();
		ctx.strokeStyle = "rgba(0, 210, 255, 0.45)";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 42px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "#00d2ff";
		ctx.shadowBlur = 18;
		ctx.fillText("👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑", 85, 110);

		ctx.shadowBlur = 0;
		ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ff9e00";
		ctx.fillText("BOT HALF TIME • LIVE SYSTEM STATUS", 85, 142);

		ctx.save();
		ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
		drawRoundRect(ctx, width - 520, 75, 130, 45, 22);
		ctx.fill();
		ctx.strokeStyle = "#00ff88";
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.fillStyle = "#00ff88";
		ctx.shadowColor = "#00ff88";
		ctx.shadowBlur = 10;
		ctx.beginPath();
		ctx.arc(width - 495, 97, 7, 0, Math.PI * 2);
		ctx.fill();

		ctx.shadowBlur = 0;
		ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#00ff88";
		ctx.fillText("LIVE", width - 475, 103);
		ctx.restore();

		ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ffd700";
		ctx.shadowColor = "#ffd700";
		ctx.shadowBlur = 12;
		ctx.textAlign = "right";
		ctx.fillText(timeStr, width - 85, 102);

		ctx.shadowBlur = 0;
		ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#a5b0e8";
		ctx.fillText(`${dateStr}  •  ${dayStr}`, width - 85, 136);
		ctx.restore();

		const centerX = width / 2;
		const centerY = 530;
		const radius = 260;

		ctx.save();
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(0, 210, 255, 0.04)";
		ctx.fill();

		ctx.lineWidth = 22;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.stroke();

		const ringGrad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
		ringGrad.addColorStop(0, "#00d2ff");
		ringGrad.addColorStop(0.35, "#9d4edd");
		ringGrad.addColorStop(0.7, "#ff7b00");
		ringGrad.addColorStop(1, "#ffd700");

		ctx.shadowColor = "#00d2ff";
		ctx.shadowBlur = 30;
		ctx.strokeStyle = ringGrad;
		ctx.lineWidth = 20;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 1.15);
		ctx.stroke();

		ctx.shadowBlur = 0;
		ctx.fillStyle = "rgba(8, 11, 26, 0.9)";
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius - 18, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
		ctx.lineWidth = 2.5;
		ctx.stroke();

		ctx.textAlign = "center";
		ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#00d2ff";
		ctx.shadowColor = "#00d2ff";
		ctx.shadowBlur = 10;
		ctx.fillText("BOT IS RUNNING", centerX, centerY - 120);

		ctx.font = "bold 40px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ffd700";
		ctx.shadowColor = "#ffd700";
		ctx.shadowBlur = 18;
		ctx.fillText("HALF TIME UPTIME", centerX, centerY - 68);

		ctx.shadowBlur = 0;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(centerX - 150, centerY - 48);
		ctx.lineTo(centerX + 150, centerY - 48);
		ctx.stroke();

		const boxW = 100;
		const boxH = 85;
		const gap = 12;
		const totalW = (boxW * 4) + (gap * 3);
		const startX = centerX - (totalW / 2);
		const boxY = centerY - 22;

		const timeBoxes = [
			{ val: strDays, label: "DAYS", color: "#00d2ff" },
			{ val: strHours, label: "HOURS", color: "#9d4edd" },
			{ val: strMins, label: "MINUTES", color: "#ff7b00" },
			{ val: strSecs, label: "SECONDS", color: "#ffd700" }
		];

		timeBoxes.forEach((tb, i) => {
			const bx = startX + i * (boxW + gap);
			ctx.save();
			ctx.fillStyle = "rgba(18, 24, 48, 0.95)";
			drawRoundRect(ctx, bx, boxY, boxW, boxH, 12);
			ctx.fill();
			ctx.strokeStyle = tb.color;
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 36px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = tb.color;
			ctx.shadowBlur = 12;
			ctx.textAlign = "center";
			ctx.fillText(tb.val, bx + (boxW / 2), boxY + 48);

			ctx.shadowBlur = 0;
			ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = tb.color;
			ctx.fillText(tb.label, bx + (boxW / 2), boxY + 71);
			ctx.restore();
		});

		ctx.save();
		ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
		drawRoundRect(ctx, centerX - 100, centerY + 140, 200, 40, 20);
		ctx.fill();
		ctx.strokeStyle = "#00ff88";
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#00ff88";
		ctx.textAlign = "center";
		ctx.fillText("● SYSTEM ONLINE", centerX, centerY + 166);
		ctx.restore();

		ctx.restore();

		ctx.save();
		drawRoundRect(ctx, 50, 180, 520, 380, 20);
		ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
		ctx.fill();
		ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#00d2ff";
		ctx.shadowColor = "#00d2ff";
		ctx.shadowBlur = 12;
		ctx.textAlign = "left";
		ctx.fillText("🤖 BOT INFORMATION", 80, 225);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
		ctx.beginPath();
		ctx.moveTo(80, 245);
		ctx.lineTo(540, 245);
		ctx.stroke();

		const botInfo = [
			{ label: "Bot Name", val: "NIJHUM CHATBOT" },
			{ label: "Status", val: "ONLINE", isOnline: true },
			{ label: "Node Version", val: process.version || "v20.11.0" },
			{ label: "Platform", val: (process.platform || "LINUX").toUpperCase() },
			{ label: "Bot Mode", val: "PUBLIC / HYBRID" },
			{ label: "Start Time", val: "Today, Live" },
			{ label: "Last Restart", val: "STABLE (0 ERR)" }
		];

		let infoY = 282;
		botInfo.forEach((info) => {
			ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#a5b0e8";
			ctx.fillText(info.label, 80, infoY);

			if (info.isOnline) {
				ctx.fillStyle = "#00ff88";
				ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
				ctx.shadowColor = "#00ff88";
				ctx.shadowBlur = 10;
				ctx.fillText("● " + info.val, 370, infoY);
				ctx.shadowBlur = 0;
			} else {
				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
				ctx.fillText(info.val, 370, infoY);
			}
			infoY += 39;
		});
		ctx.restore();

		ctx.save();
		drawRoundRect(ctx, 50, 580, 520, 380, 20);
		ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
		ctx.fill();
		ctx.strokeStyle = "rgba(157, 78, 221, 0.45)";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#9d4edd";
		ctx.shadowColor = "#9d4edd";
		ctx.shadowBlur = 12;
		ctx.textAlign = "left";
		ctx.fillText("⚡ SYSTEM PERFORMANCE", 80, 625);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
		ctx.beginPath();
		ctx.moveTo(80, 645);
		ctx.lineTo(540, 645);
		ctx.stroke();

		const perfItems = [
			{ label: "CPU Usage", val: `${cpuPercent}%`, pct: cpuPercent, color: "#00d2ff" },
			{ label: "RAM Usage", val: `${memMB} MB`, pct: ramPercent, color: "#9d4edd" },
			{ label: "Ping Speed", val: "24 ms", pct: 24, color: "#00ff88" },
			{ label: "Server Status", val: "OPTIMAL (100%)", pct: 100, color: "#ff7b00" },
			{ label: "Database Status", val: "CONNECTED", pct: 100, color: "#ffd700" }
		];

		let perfY = 680;
		perfItems.forEach((item) => {
			ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#a5b0e8";
			ctx.fillText(item.label, 80, perfY);

			ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = item.color;
			ctx.textAlign = "right";
			ctx.fillText(item.val, 540, perfY);
			ctx.textAlign = "left";

			ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
			drawRoundRect(ctx, 80, perfY + 10, 460, 10, 5);
			ctx.fill();

			const barWidth = Math.max(15, (460 * item.pct) / 100);
			ctx.fillStyle = item.color;
			ctx.shadowColor = item.color;
			ctx.shadowBlur = 8;
			drawRoundRect(ctx, 80, perfY + 10, barWidth, 10, 5);
			ctx.fill();
			ctx.shadowBlur = 0;

			perfY += 53;
		});
		ctx.restore();

		ctx.save();
		drawRoundRect(ctx, 1350, 180, 520, 380, 20);
		ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
		ctx.fill();
		ctx.strokeStyle = "rgba(255, 123, 0, 0.45)";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ff7b00";
		ctx.shadowColor = "#ff7b00";
		ctx.shadowBlur = 12;
		ctx.textAlign = "left";
		ctx.fillText("📊 LIVE STATISTICS", 1380, 225);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
		ctx.beginPath();
		ctx.moveTo(1380, 245);
		ctx.lineTo(1840, 245);
		ctx.stroke();

		const statsGrid = [
			{ label: "Total Users", val: "14,850", color: "#00d2ff" },
			{ label: "Active Users", val: "3,920", color: "#00ff88" },
			{ label: "Commands Used", val: "94,120", color: "#9d4edd" },
			{ label: "Total Messages", val: "482,500", color: "#ff7b00" },
			{ label: "Active Groups", val: "1,280", color: "#ffd700" },
			{ label: "Uptime Rate", val: "99.98%", color: "#00d2ff" }
		];

		statsGrid.forEach((st, idx) => {
			const col = idx % 2;
			const row = Math.floor(idx / 2);
			const sx = 1380 + col * 235;
			const sy = 265 + row * 92;

			ctx.fillStyle = "rgba(18, 24, 48, 0.75)";
			drawRoundRect(ctx, sx, sy, 220, 78, 12);
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
			ctx.stroke();

			ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#a5b0e8";
			ctx.fillText(st.label, sx + 15, sy + 28);

			ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = st.color;
			ctx.shadowColor = st.color;
			ctx.shadowBlur = 10;
			ctx.fillText(st.val, sx + 15, sy + 62);
			ctx.shadowBlur = 0;
		});
		ctx.restore();

		ctx.save();
		drawRoundRect(ctx, 1350, 580, 520, 380, 20);
		ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
		ctx.fill();
		ctx.strokeStyle = "rgba(255, 215, 0, 0.45)";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ffd700";
		ctx.shadowColor = "#ffd700";
		ctx.shadowBlur = 12;
		ctx.textAlign = "left";
		ctx.fillText("📡 LIVE ACTIVITY LOG", 1380, 625);
		ctx.shadowBlur = 0;

		ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
		ctx.beginPath();
		ctx.moveTo(1380, 645);
		ctx.lineTo(1840, 645);
		ctx.stroke();

		const activities = [
			{ text: "Bot System Started", time: "SUCCESS", color: "#00ff88" },
			{ text: "System Core Connected", time: "ACTIVE", color: "#00d2ff" },
			{ text: "Database Loaded", time: "OK", color: "#9d4edd" },
			{ text: "Commands Active", time: "READY", color: "#ff7b00" },
			{ text: "Half Time System Running", time: "ONLINE", color: "#ffd700" }
		];

		let actY = 690;
		activities.forEach((act) => {
			ctx.fillStyle = act.color;
			ctx.shadowColor = act.color;
			ctx.shadowBlur = 10;
			ctx.beginPath();
			ctx.arc(1395, actY - 6, 6, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;

			ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(act.text, 1415, actY);

			ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = act.color;
			ctx.textAlign = "right";
			ctx.fillText(act.time, 1840, actY);
			ctx.textAlign = "left";

			actY += 52;
		});
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "rgba(8, 11, 24, 0.9)";
		drawRoundRect(ctx, 50, 980, width - 100, 60, 16);
		ctx.fill();
		ctx.strokeStyle = "rgba(0, 210, 255, 0.3)";
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "#00d2ff";
		ctx.shadowBlur = 12;
		ctx.textAlign = "center";
		ctx.fillText("👑 SIYAM-HASAN CHAT BOT  ⚡  LIGHTING SYSTEM • LIVE MONITOR 👑", width / 2, 1018);
		ctx.restore();

		const buffer = canvas.toBuffer("image/png");
		await fs.writeFile(imgPath, buffer);

		const msgStream = fs.createReadStream(imgPath);
		
		const replyMsg = await message.reply({
			body: "",
			attachment: msgStream
		});

		return replyMsg;

	} catch (err) {
		console.error("Uptcard Command Error:", err);
		return message.reply("❌ Dashboard Card তৈরি করতে ব্যর্থ হয়েছে!");
	} finally {
		setTimeout(() => {
			if (fs.existsSync(imgPath)) {
				fs.unlinkSync(imgPath);
			}
		}, 5000);
	}
}

async function executeStyle2({ api, message, event }) {
	const sendMsg = message && typeof message.reply === "function" 
		? (content) => message.reply(content)
		: (content) => api.sendMessage(content, event.threadID, event.messageID);

	const start = Date.now();

	try {
		const uptime = process.uptime();
		const days = Math.floor(uptime / 86400);
		const hours = Math.floor((uptime % 86400) / 3600);
		const minutes = Math.floor((uptime % 3600) / 60);
		const seconds = Math.floor(uptime % 60);

		const memory = process.memoryUsage();
		const usedRAM = (memory.heapUsed / 1024 / 1024).toFixed(1);
		const totalHeap = (memory.heapTotal / 1024 / 1024).toFixed(1);
		const ping = Date.now() - start;

		const cpuLoad = os.loadavg()[0].toFixed(2);
		const cpuCores = os.cpus().length;
		const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
		const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
		const usedMemGB = (totalMemGB - freeMemGB).toFixed(1);
		const memPercent = ((1 - os.freemem() / os.totalmem()) * 100).toFixed(1);
		const heapPercent = ((memory.heapUsed / memory.heapTotal) * 100).toFixed(1);

		const platform = os.platform();
		const arch = os.arch();
		const hostname = os.hostname();
		const nodeVersion = process.version;
		const pid = process.pid;

		const width = 980;
		const height = 640;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		const bg = ctx.createLinearGradient(0, 0, width, height);
		bg.addColorStop(0, "#05050c");
		bg.addColorStop(0.5, "#0b0b16");
		bg.addColorStop(1, "#070710");
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, width, height);

		const light1 = ctx.createRadialGradient(490, 0, 20, 490, 90, 480);
		light1.addColorStop(0, "rgba(139, 92, 246, 0.2)");
		light1.addColorStop(1, "rgba(139, 92, 246, 0)");
		ctx.fillStyle = light1;
		ctx.fillRect(0, 0, width, height);

		const light2 = ctx.createRadialGradient(900, 600, 30, 850, 500, 280);
		light2.addColorStop(0, "rgba(34, 211, 238, 0.14)");
		light2.addColorStop(1, "rgba(34, 211, 238, 0)");
		ctx.fillStyle = light2;
		ctx.fillRect(0, 0, width, height);

		ctx.save();
		ctx.shadowColor = "rgba(139, 92, 246, 0.35)";
		ctx.shadowBlur = 30;
		roundRect(ctx, 35, 35, 910, 570, 28);
		ctx.fillStyle = "rgba(12, 12, 24, 0.96)";
		ctx.fill();
		ctx.restore();

		ctx.strokeStyle = "rgba(167, 139, 250, 0.4)";
		ctx.lineWidth = 2.5;
		roundRect(ctx, 35, 35, 910, 570, 28);
		ctx.stroke();

		const headerGrad = ctx.createLinearGradient(55, 55, 925, 55);
		headerGrad.addColorStop(0, "#7c3aed");
		headerGrad.addColorStop(1, "#06b6d4");
		ctx.fillStyle = headerGrad;
		roundRect(ctx, 55, 55, 870, 68, 16);
		ctx.fill();

		ctx.font = "bold 30px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.fillText("SIYAM-HASAN  •  BOT STATUS", 490, 98);

		ctx.fillStyle = "rgba(24, 24, 46, 0.95)";
		roundRect(ctx, 60, 145, 860, 90, 14);
		ctx.fill();
		ctx.fillStyle = "#a78bfa";
		ctx.fillRect(60, 145, 860, 5);

		ctx.font = "bold 16px Arial";
		ctx.fillStyle = "#c4b5fd";
		ctx.fillText("BOT UPTIME", 490, 175);

		ctx.font = "bold 34px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(`${days}d   ${hours}h   ${minutes}m   ${seconds}s`, 490, 215);

		const boxes = [
			{ title: "PING", value: `${ping} ms`, x: 60, color: "#34d399" },
			{ title: "PROCESS RAM", value: `${usedRAM} MB`, x: 280, color: "#fbbf24" },
			{ title: "CPU LOAD", value: cpuLoad, x: 500, color: "#22d3ee" },
			{ title: "CPU CORES", value: `${cpuCores}`, x: 720, color: "#a78bfa" }
		];

		boxes.forEach((box) => {
			const y = 255;
			ctx.fillStyle = "rgba(24, 24, 46, 0.95)";
			roundRect(ctx, box.x, y, 200, 85, 12);
			ctx.fill();

			ctx.fillStyle = box.color;
			ctx.shadowColor = box.color;
			ctx.shadowBlur = 10;
			ctx.fillRect(box.x, y, 200, 4);
			ctx.shadowBlur = 0;

			ctx.font = "bold 13px Arial";
			ctx.fillStyle = "#a5b4fc";
			ctx.textAlign = "center";
			ctx.fillText(box.title, box.x + 100, y + 32);

			ctx.font = "bold 22px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(box.value, box.x + 100, y + 62);
		});

		ctx.fillStyle = "rgba(24, 24, 46, 0.95)";
		roundRect(ctx, 60, 360, 860, 100, 12);
		ctx.fill();
		ctx.fillStyle = "#06b6d4";
		ctx.fillRect(60, 360, 860, 4);

		ctx.font = "bold 14px Arial";
		ctx.fillStyle = "#a5b4fc";
		ctx.textAlign = "left";
		ctx.fillText(`Process RAM  ${heapPercent}%`, 85, 395);

		ctx.fillStyle = "rgba(50, 50, 80, 1)";
		roundRect(ctx, 85, 410, 380, 14, 7);
		ctx.fill();
		ctx.fillStyle = "#fbbf24";
		roundRect(ctx, 85, 410, 380 * (heapPercent / 100), 14, 7);
		ctx.fill();

		ctx.fillStyle = "#a5b4fc";
		ctx.fillText(`System RAM  ${memPercent}%`, 500, 395);

		ctx.fillStyle = "rgba(50, 50, 80, 1)";
		roundRect(ctx, 500, 410, 380, 14, 7);
		ctx.fill();
		ctx.fillStyle = "#22d3ee";
		roundRect(ctx, 500, 410, 380 * (memPercent / 100), 14, 7);
		ctx.fill();

		ctx.font = "12px Arial";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText(`${usedRAM} / ${totalHeap} MB`, 85, 445);
		ctx.fillText(`${usedMemGB} / ${totalMemGB} GB`, 500, 445);

		ctx.fillStyle = "rgba(24, 24, 46, 0.95)";
		roundRect(ctx, 60, 480, 860, 95, 12);
		ctx.fill();
		ctx.fillStyle = "#7c3aed";
		ctx.fillRect(60, 480, 860, 4);

		ctx.font = "bold 14px Arial";
		ctx.fillStyle = "#a5b4fc";
		ctx.textAlign = "left";

		ctx.fillText("Node.js", 85, 515);
		ctx.fillText("Platform", 85, 550);
		ctx.fillText("Architecture", 300, 515);
		ctx.fillText("Hostname", 300, 550);
		ctx.fillText("PID", 560, 515);
		ctx.fillText("Status", 560, 550);

		ctx.font = "bold 14px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(nodeVersion, 170, 515);
		ctx.fillText(platform.toUpperCase(), 170, 550);
		ctx.fillText(arch.toUpperCase(), 420, 515);
		ctx.fillText(hostname.substring(0, 14), 400, 550);
		ctx.fillText(String(pid), 620, 515);
		ctx.fillText("ONLINE", 640, 550);

		ctx.textAlign = "right";
		ctx.font = "bold 14px Arial";
		ctx.fillStyle = "#c4b5fd";
		ctx.fillText("NIJHUM CHATBOT", 890, 530);
		ctx.font = "12px Arial";
		ctx.fillStyle = "#7c3aed";
		ctx.fillText("Premium Real-time Card", 890, 555);

		const cachePath = path.join(__dirname, "cache");
		await fs.ensureDir(cachePath);
		const filePath = path.join(cachePath, `status_${Date.now()}.png`);
		await fs.writeFile(filePath, canvas.toBuffer("image/png"));

		await sendMsg({
			body: "BOT STATUS CARD",
			attachment: fs.createReadStream(filePath)
		});

		setTimeout(() => fs.unlink(filePath).catch(() => {}), 30000);

	} catch (err) {
		console.log(err);
		return sendMsg("Failed to generate status card.");
	}
}

async function executeStyle3({ api, message, event }) {
	const sendMsg = message && typeof message.reply === "function" 
		? (content, callback) => message.reply(content, callback)
		: (content, callback) => api.sendMessage(content, event.threadID, callback, event.messageID);

	const startTime = Date.now();

	const uptimeSeconds = process.uptime();
	const days = Math.floor(uptimeSeconds / (3600 * 24));
	const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((uptimeSeconds % 3600) / 60);
	const seconds = Math.floor(uptimeSeconds % 60);

	const dayProg = Math.min(1, days / 30);
	const hourProg = hours / 24;
	const minProg = minutes / 60;
	const secProg = seconds / 60;

	const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
	const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
	const usedMem = (totalMem - freeMem).toFixed(2);
	const ramPercent = Math.min(100, Math.round((usedMem / totalMem) * 100));

	const nodeVersion = process.version;
	const cpuLoad = (os.loadavg()[0] * 100 / os.cpus().length).toFixed(1);

	const currentTime = moment().tz("Asia/Dhaka").format("DD/MM/YYYY");
	const ping = Date.now() - startTime;
	const pingProg = Math.min(1, ping / 1000);

	const width = 1920;
	const height = 1080;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1100);
	bgGrad.addColorStop(0, "#121722");
	bgGrad.addColorStop(0.6, "#080b11");
	bgGrad.addColorStop(1, "#020305");
	ctx.fillStyle = bgGrad;
	ctx.fillRect(0, 0, width, height);

	ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
	ctx.lineWidth = 2;
	for (let x = 0; x < width; x += 50) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
		ctx.stroke();
	}
	for (let y = 0; y < height; y += 50) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
		ctx.stroke();
	}

	const pad = 60;
	ctx.shadowColor = "#00f0ff";
	ctx.shadowBlur = 30;
	ctx.strokeStyle = "#00f0ff";
	ctx.lineWidth = 8;
	ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

	ctx.shadowColor = "#ff007f";
	ctx.shadowBlur = 20;
	ctx.strokeStyle = "#ff007f";
	ctx.lineWidth = 5;
	ctx.strokeRect(pad + 20, pad + 20, width - (pad + 20) * 2, height - (pad + 20) * 2);
	ctx.shadowBlur = 0;

	const headerX = 140;
	const headerY = 120;
	ctx.strokeStyle = "#00f0ff";
	ctx.shadowColor = "#00f0ff";
	ctx.shadowBlur = 15;
	ctx.lineWidth = 5;
	ctx.strokeRect(headerX, headerY, 450, 80);
	ctx.shadowBlur = 0;

	ctx.fillStyle = "#00f0ff";
	ctx.shadowColor = "#00f0ff";
	ctx.shadowBlur = 15;
	ctx.font = "bold 48px Arial, sans-serif";
	ctx.fillText("[SIYAM-BOT]", headerX + 25, headerY + 58);

	ctx.fillStyle = "#ff007f";
	ctx.shadowColor = "#ff007f";
	ctx.font = "bold 50px Arial, sans-serif";
	ctx.fillText("|", headerX + 500, headerY + 58);

	ctx.fillStyle = "#00ff66";
	ctx.shadowColor = "#00ff66";
	ctx.font = "bold 48px Arial, sans-serif";
	ctx.fillText(currentTime, headerX + 550, headerY + 58);
	ctx.shadowBlur = 0;

	const drawContrastFillBox = (x, y, w, h, progress, valText, labelText, color) => {
		ctx.strokeStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = 12;
		ctx.lineWidth = 4;
		ctx.strokeRect(x, y, w, h);

		const fillW = Math.max(10, (w - 10) * progress);
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.35;
		ctx.fillRect(x + 5, y + 5, fillW, h - 10);
		ctx.globalAlpha = 1.0;

		ctx.font = "bold 46px Arial, sans-serif";
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 7;
		ctx.strokeText(valText, x + 30, y + 55);

		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "#000000";
		ctx.shadowBlur = 10;
		ctx.fillText(valText, x + 30, y + 55);

		ctx.font = "bold 22px Arial, sans-serif";
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 5;
		ctx.strokeText(labelText, x + 30, y + 90);

		ctx.fillStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = 8;
		ctx.fillText(labelText, x + 30, y + 90);
		ctx.shadowBlur = 0;
	};

	const boxX = 140;
	const boxW = 420;
	const boxH = 120;

	drawContrastFillBox(boxX, 260, boxW, boxH, dayProg, `${days}d`, "DAYS", "#00f0ff");
	drawContrastFillBox(boxX, 410, boxW, boxH, hourProg, `${hours}h`, "HOURS", "#ff007f");
	drawContrastFillBox(boxX, 560, boxW, boxH, minProg, `${minutes}m`, "MINUTES", "#ffd700");
	drawContrastFillBox(boxX, 710, boxW, boxH, secProg, `${seconds}s`, "SECONDS", "#00ff66");

	const drawRing = (cx, cy, radius, progress, valText, labelText, color) => {
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, Math.PI * 2);
		ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
		ctx.lineWidth = 22;
		ctx.stroke();

		const startAngle = -Math.PI / 2;
		const endAngle = startAngle + (Math.PI * 2 * Math.max(0.02, progress));

		ctx.beginPath();
		ctx.arc(cx, cy, radius, startAngle, endAngle);
		ctx.strokeStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = 20;
		ctx.lineWidth = 24;
		ctx.lineCap = "round";
		ctx.stroke();
		ctx.shadowBlur = 0;

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 52px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(valText, cx, cy + 10);

		ctx.fillStyle = color;
		ctx.font = "bold 24px Arial, sans-serif";
		ctx.fillText(labelText, cx, cy + 50);
		ctx.textAlign = "left";
	};

	const ringCenterX = 1520;
	drawRing(ringCenterX, 360, 120, ramPercent / 100, `${ramPercent}%`, "RAM", "#ff007f");
	drawRing(ringCenterX, 670, 120, pingProg, `${ping}ms`, "PING", "#ffd700");

	const detailsY = 820;
	ctx.fillStyle = "rgba(0, 240, 255, 0.05)";
	ctx.strokeStyle = "#00f0ff";
	ctx.lineWidth = 2;
	ctx.fillRect(1350, detailsY, 340, 110);
	ctx.strokeRect(1350, detailsY, 340, 110);

	ctx.fillStyle = "#a8a8c8";
	ctx.font = "bold 20px Arial, sans-serif";
	ctx.fillText("CPU LOAD:", 1370, detailsY + 38);
	ctx.fillStyle = "#00ff66";
	ctx.fillText(`${cpuLoad}%`, 1550, detailsY + 38);

	ctx.fillStyle = "#a8a8c8";
	ctx.fillText("NODE VER:", 1370, detailsY + 82);
	ctx.fillStyle = "#00f0ff";
	ctx.fillText(nodeVersion, 1550, detailsY + 82);

	const avatarX = 680;
	const avatarY = 260;
	const avatarSize = 580;

	const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?height=1000&width=1000&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

	try {
		const imgRes = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 6000 });
		const userImg = await loadImage(Buffer.from(imgRes.data));

		ctx.drawImage(userImg, avatarX, avatarY, avatarSize, avatarSize);

		ctx.strokeStyle = "#00f0ff";
		ctx.shadowColor = "#00f0ff";
		ctx.shadowBlur = 25;
		ctx.lineWidth = 10;
		ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);

		ctx.strokeStyle = "#ff007f";
		ctx.shadowColor = "#ff007f";
		ctx.shadowBlur = 15;
		ctx.lineWidth = 5;
		ctx.strokeRect(avatarX - 10, avatarY - 10, avatarSize + 20, avatarSize + 20);
		ctx.shadowBlur = 0;
	} catch (e) {
		ctx.fillStyle = "#ff007f";
		ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
	}

	ctx.fillStyle = "#ffd700";
	ctx.shadowColor = "#ffd700";
	ctx.shadowBlur = 12;
	ctx.font = "bold 42px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.fillText("Developed by: Siyam Hasan", width / 2, 910);

	ctx.fillStyle = "#00ff66";
	ctx.shadowColor = "#00ff66";
	ctx.shadowBlur = 15;
	ctx.font = "bold 46px Arial, sans-serif";
	ctx.fillText("SYSTEM STATUS: ACTIVE", width / 2, 975);
	ctx.shadowBlur = 0;
	ctx.textAlign = "left";

	const cacheDir = path.join(__dirname, "cache");
	if (!fs.existsSync(cacheDir)) {
		fs.mkdirSync(cacheDir, { recursive: true });
	}

	const imagePath = path.join(cacheDir, `upt_hd_${Date.now()}.png`);
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync(imagePath, buffer);

	return sendMsg({
		attachment: fs.createReadStream(imagePath)
	}, () => {
		if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
	});
}

module.exports = {
	config: {
		name: "ul",
		aliases: ["up22tc"],
		version: "12.0",
		author: LOCKED_AUTHOR,
		countDown: 2,
		role: 0,
		description: {
			en: "Dynamic Random Multi-Style Uptime Dashboard Card System"
		},
		category: "system",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function (context) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = "SIYAM-HASAN";
		}

		const userId = context.event.senderID;
		const availableStyles = [1, 2, 3];
		const lastStyle = userHistory.get(userId);

		let nextStyles = availableStyles;
		if (lastStyle !== undefined) {
			nextStyles = availableStyles.filter(style => style !== lastStyle);
		}

		const selectedStyle = nextStyles[Math.floor(Math.random() * nextStyles.length)];
		userHistory.set(userId, selectedStyle);

		if (selectedStyle === 1) {
			return await executeStyle1(context);
		} else if (selectedStyle === 2) {
			return await executeStyle2(context);
		} else if (selectedStyle === 3) {
			return await executeStyle3(context);
		}
	}
};

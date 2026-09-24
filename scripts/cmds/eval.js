const { removeHomeDir, log } = global.utils;

module.exports = {
	config: {
		name: "eval",
		version: "1.7",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 2,
		description: {
			vi: "Test code nhanh",
			en: "Test code quickly"
		},
		category: "owner",
		guide: {
			vi: "{pn} <đoạn code cần test>",
			en: "{pn} <code to test>"
		}
	},

	langs: {
		vi: {
			error: "❌ Đã có lỗi xảy ra:"
		},
		en: {
			error: "❌ An error occurred:"
		}
	},

	onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
		function output(msg) {
			if (typeof msg === "number" || typeof msg === "boolean" || typeof msg === "function") {
				msg = msg.toString();
			} else if (msg instanceof Map) {
				let text = `Map(${msg.size}) `;
				text += JSON.stringify(mapToObj(msg), null, 2);
				msg = text;
			} else if (typeof msg === "object") {
				msg = JSON.stringify(msg, null, 2);
			} else if (typeof msg === "undefined") {
				msg = "undefined";
			}

			message.reply(msg);
		}

		function out(msg) {
			output(msg);
		}

		function mapToObj(map) {
			const obj = {};
			map.forEach((v, k) => {
				obj[k] = v;
			});
			return obj;
		}

		// Console.log রিডাইরেক্ট করার জন্য
		const oldLog = console.log;
		console.log = function (...logArgs) {
			logArgs.forEach(arg => output(arg));
			oldLog.apply(console, logArgs);
		};

		const cmd = `
		(async () => {
			try {
				${args.join(" ")}
			}
			catch(err) {
				log.err("eval command", err);
				message.reply(
					"${getLang("error")}\\n" +
					(err.stack ?
						removeHomeDir(err.stack) :
						removeHomeDir(JSON.stringify(err, null, 2) || "")
					)
				);
			} finally {
				console.log = oldLog;
			}
		})()`;

		eval(cmd);
	}
};

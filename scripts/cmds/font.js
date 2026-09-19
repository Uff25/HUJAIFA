module.exports = {
    config: {
        name: "font",
        version: "4.0.0",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Convert text to 50+ stylish fonts"
        },
        longDescription: {
            en: "Convert text into 50+ different styles without name labels, supporting unlimited multi-replies."
        },
        category: "utility"
    },

    convertFont: function (text, styleId) {
        const charMaps = {
            1: { uppercase: 0x1D400, lowercase: 0x1D41A, digits: 0x1D7CE }, // Bold Serif
            2: { uppercase: 0x1D434, lowercase: 0x1D44E, digits: null },    // Italic Serif
            3: { uppercase: 0x1D468, lowercase: 0x1D482, digits: null },    // Bold Italic Serif
            4: { uppercase: 0x1D4D0, lowercase: 0x1D4EA, digits: null },    // Script / Cursive
            5: { uppercase: 0x1D49C, lowercase: 0x1D4B6, digits: null },    // Bold Script
            6: { uppercase: 0x1D504, lowercase: 0x1D51E, digits: null },    // Fraktur / Gothic
            7: { uppercase: 0x1D56C, lowercase: 0x1D586, digits: null },    // Bold Fraktur
            8: { uppercase: 0x1D670, lowercase: 0x1D68A, digits: 0x1D7F6 }, // Monospace
            9: { uppercase: 0x1D5A0, lowercase: 0x1D5BA, digits: 0x1D7E2 }, // Sans-Serif Normal
            10: { uppercase: 0x1D5D4, lowercase: 0x1D5EE, digits: 0x1D7EC },// Sans-Serif Bold
            11: { uppercase: 0x1D608, lowercase: 0x1D622, digits: null },   // Sans-Serif Italic
            12: { uppercase: 0x1D538, lowercase: 0x1D552, digits: 0x1D7D8 },// Double Struck / Outline
            13: { uppercase: 0x24B6, lowercase: 0x24D0, digits: 0x2460 },  
            14: { uppercase: 0x1F130, lowercase: 0x1F130, digits: null }, 
            15: { uppercase: 0x1F170, lowercase: 0x1F170, digits: null }   
        };

        const staticMaps = {
            16: { a:"ᴀ", b:"ʙ", c:"ᴄ", d:"ᴅ", e:"ᴇ", f:"ғ", g:"ɢ", h:"ʜ", i:"ɪ", j:"ᴊ", k:"ᴋ", l:"ʟ", m:"ᴍ", n:"ɴ", o:"ᴏ", p:"ᴘ", q:"ǫ", r:"ʀ", s:"s", t:"ᴛ", u:"ᴜ", v:"ᴠ", w:"ᴡ", x:"x", y:"ʏ", z:"ᴢ" },
            17: { a:"ɐ", b:"q", c:"ɔ", d:"p", e:"ǝ", f:"ɟ", g:"ƃ", h:"ɥ", i:"ᴉ", j:"ɾ", k:"ʞ", l:"l", m:"ɯ", n:"u", o:"o", p:"d", q:"b", r:"ɹ", s:"s", t:"ʇ", u:"n", v:"ʌ", w:"ʍ", x:"x", y:"ʎ", z:"z", A:"∀", B:"𐐒", C:"Ɔ", D:"Ɐ", E:"Ǝ", F:"Ⅎ", G:"⅁", H:"H", I:"I", J:"ſ", K:"Ʞ", L:"Ꞁ", M:"W", N:"N", O:"O", P:"Ԁ", Q:"Ò", R:"ᴚ", S:"S", T:"┴", U:"∩", V:"Λ", W:"M", X:"X", Y:"⅄", Z:"Z" },
            18: { a:"₳", b:"฿", c:"₵", d:"Đ", e:"Ɇ", f:"₣", g:"₲", h:"Ⱨ", i:"I", j:"J", k:"₭", l:"Ⱡ", m:"₥", n:"₦", o:"Ø", p:"₱", q:"Q", r:"Ɽ", s:"₴", t:"₮", u:"Ʉ", v:"V", w:"₩", x:"Ӿ", y:"¥", z:"Ⱬ", A:"₳", B:"฿", C:"₵", D:"Đ", E:"Ɇ", F:"₣", G:"₲", H:"Ⱨ", I:"I", J:"J", K:"₭", L:"Ⱡ", M:"₥", N:"₦", O:"Ø", P:"₱", Q:"Q", R:"Ɽ", S:"₴", T:"₮", U:"Ʉ", V:"V", W:"₩", X:"Ӿ", Y:"¥", Z:"Ⱬ" },
            19: text.split("").join(" "),
            20: text.split("").join(" . ")
        };

        
        const frameDecorators = {
            21: str => `•´¯\`•. ${str} .•´¯\`•`,
            22: str => `★彡 [ ${str} ] 彡★`,
            23: str => `◤ ${str} ◢`,
            24: str => `❖ ${str} ❖`,
            25: str => `꧁¹³⁴  ${str}  ¹³⁴꧂`,
            26: str => `╰┈➤ ${str}`,
            27: str => `━━━━ ${str} ━━━━`,
            28: str => `❮❮ ${str} ❯❯`,
            29: str => `『 ${str} 』`,
            30: str => `【 ${str} 】`,
            31: str => `〔 ${str} 〕`,
            32: str => `〘 ${str} 〙`,
            33: str => `《 ${str} 》`,
            34: str => `⫸ ${str} ⫷`,
            35: str => `★═━ ${str} ━═★`,
            36: str => `⚡ ${str} ⚡`,
            37: str => `✧○ꊞ○ ${str} ○ꊞ○✧`,
            38: str => `ღ ${str} ღ`,
            39: str => `༨ ${str} ༩`,
            40: str => `༇ ${str} ༇`,
            41: str => `♛ ${str} ♛`,
            42: str => `♬ ${str} ♬`,
            43: str => `✿ ${str} ✿`,
            44: str => `❉ ${str} ❉`,
            45: str => `⚓ ${str} ⚓`,
            46: str => `✦ ${str} ✦`,
            47: str => `༺ ${str} ༻`,
            48: str => `╰𓆩 ${str} 𓆪╮`,
            49: str => `⚡︎ ${str} ⚡︎`,
            50: str => `⭓ ${str} ⭓`,
            51: str => `『 ${str} 』`,
            52: str => `亗 ${str} 亗`
        };

      
        if (frameDecorators[styleId]) {
            const baseBold = this.convertFont(text, 1);
            return frameDecorators[styleId](baseBold);
        }

        if (staticMaps[styleId]) {
            if (typeof staticMaps[styleId] === "string") return staticMaps[styleId];
            const map = staticMaps[styleId];
            return text.split("").map(c => map[c] || c).join("");
        }

        const currentStyle = charMaps[styleId];
        if (!currentStyle) return text;

        return text.split("").map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(currentStyle.uppercase + (code - 65));
            if (code >= 97 && code <= 122) return String.fromCodePoint(currentStyle.lowercase + (code - 97));
            if (code >= 48 && code <= 57 && currentStyle.digits) return String.fromCodePoint(currentStyle.digits + (code - 48));
            return char;
        }).join("");
    },

    onStart: async function ({ api, event, args, message }) {
        const text = args.join(" ");
        if (!text) {
            return message.reply("❌ অনুগ্রহ করে ফন্ট পরিবর্তনের জন্য কিছু টেক্সট লিখুন। 🫢উদাহরণ: /font siyam Hasan");
        }

        let menuMsg = "";
        for (let i = 1; i <= 52; i++) {
            const preview = this.convertFont(text.length > 10 ? text.slice(0, 10) + "..." : text, i);
            menuMsg += `[ ${i} ]  ${preview}\n`;
        }

        const info = await message.reply(menuMsg);

        
        global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            text: text
        });
    },

    onReply: async function ({ api, event, Reply, message }) {
        if (!Reply || event.senderID !== Reply.author) return;

        const input = event.body.trim().split(/\s+/);
        const results = [];

        for (const item of input) {
            const choice = parseInt(item);
            if (!isNaN(choice) && choice >= 1 && choice <= 52) {
                const converted = this.convertFont(Reply.text, choice);
                results.push(`[ ${choice} ]  ${converted}`);
            }
        }

        if (results.length === 0) {
            return message.reply("🤦ভুল নম্বর। ১ থেকে ৫২ এর মধ্যে নম্বর দিন🙍🤷।");
        }

    
        return message.reply(results.join("\n\n"));
    }
};

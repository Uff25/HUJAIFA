const activeSessions = new Map();

module.exports.config = {
    name: "su2",
    version: "1.6",
    role: 2,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Fast tag Banglish list (1-2 seconds gap)",
    category: "nsfw",
    guide: "{pn} @mention, reply or chudi off",
    coolDown: 10
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, mentions, type, messageReply } = event;

    if (args[0] && args[0].toLowerCase() === "off") {
        if (activeSessions.has(threadID)) {
            const timeouts = activeSessions.get(threadID);
            timeouts.forEach(clearTimeout);
            activeSessions.delete(threadID);
            return api.sendMessage("☑️", threadID, messageID);
        } else {
            return api.sendMessage("❌", threadID, messageID);
        }
    }

    let targetID;

    if (type === "message_reply") {
        targetID = messageReply.senderID;
    } 
    else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    }

    if (!targetID) {
        return api.sendMessage("বস যে মেয়েকে চুদ্দে চাউ তার আইডি @ম্যানশন দেউ", threadID, messageID);
    }

    let realName = "মাগি";
    try {
        const userInfo = await api.getUserInfo(targetID);
        realName = userInfo[targetID].name || "ইউজার";
    } catch (e) {
        realName = "মাগি";
    }

    const tagText = "@" + realName;
    const arraytag = [{ id: targetID, tag: tagText }];

    const a = (msg) => {
        if (typeof msg === "string") {
            return api.sendMessage(msg, threadID);
        }
        return api.sendMessage({ body: msg.body.replace(realName, tagText), mentions: arraytag }, threadID);
    };

    a("বস 𓆩𝐒𝐈𝐘𝐀𝐌𓆪 এর চুদা লো-🖕🥵");

    if (activeSessions.has(threadID)) {
        activeSessions.get(threadID).forEach(clearTimeout);
    }

    const timeouts = [];

    const messages = [
        { msg: "খাংকির মেয়ে তর মারে চুদি 🥰।" + " " + realName, time: 3000 },
        { msg: "খাংকির মেয়ে তর কচি বোন রে চুদি 😍.." + " " + realName, time: 5000 },
        { msg: "মাদারচোদ তর আম্মু পম পম খাংকির পো 🐰" + " " + realName, time: 7000 },
        { msg: "খাংকির মেয়ে তর কচি ভুদায় ভুদায় কামর দিমু  💔!" + " " + realName, time: 9000 },
        { msg: "খাংকি মাগির মেয়ে কথা ক কম কম তর আম্মু রে চুদে বানামু আইটেম বোম " + " " + realName, time: 12000 },
        { msg: "depression থেকেও তর মাইরে চু*** দি 🤬 " + " " + realName, time: 15000 },
        { msg: "তর আম্মু রে আচার এর লোভ দেখি চুদি মাগির মেয়ে🤬" + " " + realName, time: 17000 },
        { msg: "বান্দির মেয়ে তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟" + " " + realName, time: 20000 },
        { msg: "বান্দি মাগির মেয়ে তর আম্মু রে চুদি তর দুলা ভাই এর কান্দে ফেলে  🤝" + " " + realName, time: 23000 },
        { msg: "উফফফ খাদ্দামা মাগির মেয়ে তর আম্মুর কালা ভুদায় আমার মাল আউট তর কচি বোন রে উপ্তা করে এবার চুদবো  💉।" + " " + realName, time: 25000 },
        { msg: "অনলাইনে গালি বাজ হয়ে গেছত মাগির মেয়ে এমন চুদা দিমু লাইফ টাইম মনে রাখবি ফারহান বস তর বাপ মাগির মেয়ে 😘।" + " " + realName, time: 28500 },
        { msg: "বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে  ✋" + " " + realName, time: 31000 },
        { msg: " হাই মাদারচোদ তর তর ব্যাশা জাতের আম্মু টা রে আদর করে করে চুদি " + " " + realName, time: 36000 },
        { msg: "~ চুদা কি আরো খাবি মাগির পোল 🤖", time: 39000, raw: true },
        { msg: "খাংকির মেয়ে 🥰।" + " " + realName, time: 42000 },
        { msg: "মাদারচোদ😍.." + " " + realName, time: 48000 },
        { msg: "ব্যাস্যার মেয়ে 🐰" + " " + realName, time: 51000 },
        { msg: "ব্যাশ্যা মাগির মেয়ে  💔!" + " " + realName, time: 54000 },
        { msg: "পতিতা মাগির মেয়ে " + " " + realName, time: 57000 },
        { msg: "depression থেকেও তর মাইরে চু*** দি 🤬 " + " " + realName, time: 59400 },
        { msg: "তর মারে চুদি" + " " + realName, time: 63000 },
        { msg: "নাট বল্টু মাগির মেয়ে🤟" + " " + realName, time: 66000 },
        { msg: "তর বোন রে পায়জামা খুলে চুদি 🤣" + " " + realName, time: 69000 },
        { msg: "উম্মম্মা তর বোন এরকচি ভুদায়💉।" + " " + realName, time: 72000 },
        { msg: "DNA টেষ্ট করা দেখবি সিয়াম এর চুদা তেই তর জন্ম।" + " " + realName, time: 75000 },
        { msg: "কামলা মাগির মেয়ে  ✋" + " " + realName, time: 81000 },
        { msg: " বাস্ট্রাড এর বাচ্ছা বস্তির মেয়ে " + " " + realName, time: 87000 },
        { msg: "~ আমার জারজ শন্তান🤖", time: 93000, raw: true },
        { msg: "Welcome মাগির মেয়ে 🥰।" + " " + realName, time: 99000 },
        { msg: "তর কচি বোন এর পম পম😍.." + " " + realName, time: 105000 },
        { msg: "ব্যাস্যার মেয়ে কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰" + " " + realName, time: 111000 },
        { msg: "Hi ফারহান এর জারজ মাগির মেয়ে  💔!" + " " + realName, time: 114000 },
        { msg: "২০ টাকা এ পতিতা মাগির মেয়ে " + " " + realName, time: 120000 },
        { msg: "depression থেকেও তর মাইরে চু*** দি 🤬 " + " " + realName, time: 126000 },
        { msg: "বস্তির মেয়ে অনলাইনের কিং" + " " + realName, time: 132000 },
        { msg: "টুকাই মাগির মেয়ে🤟" + " " + realName, time: 138000 },
        { msg: "তর আম্মু রে পায়জামা খুলে চুদি 🤣" + " " + realName, time: 144000 },
        { msg: "উম্মম্মা তর বোন এরকচি ভুদায়💉।" + " " + realName, time: 150000 },
        { msg: "DNA টেষ্ট করা দেখবি আমার চুদা তেই তর জন্ম।" + " " + realName, time: 156000 },
        { msg: "হিজলা মাগির মেয়ে  ✋" + " " + realName, time: 162000 },
        { msg: " বস্তিরন্দালাল এর বাচ্ছা বস্তির মেয়ে " + " " + realName, time: 168000 },
        { msg: "~ আমার জারজ শন্তান জা ভাগ🤖", time: 171000, raw: true },
        { msg: "Welcome শুয়োরের বাচ্চা 🥰।" + " " + realName, time: 174000 },
        { msg: "কুত্তার বাচ্ছা তর কচি বোন এর পম পম😍.." + " " + realName, time: 177000 },
        { msg: "খাঙ্কির মেয়ে মেয়ে কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰" + " " + realName, time: 180000 },
        { msg: "Hi বস সিয়াম এর জারজ মেয়ে মাগির মেয়ে  💔!" + " " + realName, time: 183000 },
        { msg: "খান্কি মাগির মেয়ে " + " " + realName, time: 186000 },
        { msg: "তোর বাপে তোর নানা। 🤬 " + " " + realName, time: 189000 },
        { msg: "বস্তির মেয়ে তোর বইনরে মুসলমানি দিমু।" + " " + realName, time: 192000 },
        { msg: "টুকাই মাগির মেয়ে মোবাইল ভাইব্রেশন কইরা তুর কচি বোন এর পুকটিতে ভরবো।🤟" + " " + realName, time: 195000 },
        { msg: "তোর মুখে হাইগ্যা দিমু। 🤣" + " " + realName, time: 198000 },
        { msg: "কুত্তার পুকটি চাটামু💉।" + " " + realName, time: 201000 },
        { msg: "তর আম্মুর হোগা দিয়া ট্রেন ভইরা দিমু।।" + " " + realName, time: 204000 },
        { msg: "হিজলা মাগির মেয়ে হাতির ল্যাওড়া দিয়া তর মায়েরে চুদুম।  ✋" + " " + realName, time: 207000 },
        { msg: "তর বোন ভোদা ছিল্লা লবণ লাগায় দিমু। " + " " + realName, time: 210000 },
        { msg: "~ আমার ফাটা কন্ডমের ফসল। জা ভাগ🤖", time: 213000, raw: true },
        { msg: "Welcome শুয়োরের বাচ্চা 🥰।" + " " + realName, time: 216000 },
        { msg: "কুত্তার বাচ্ছা তর বৌন ভোদায় মাগুর মাছ চাষ করুম।😍.." + " " + realName, time: 218000 },
        { msg: "খাঙ্কিরমেয়ে মেয়ে তর বোনের  হোগায় ইনপুট, তর মায়ের ভোদায় আউটপুট।🐰" + " " + realName, time: 220000 },
        { msg: "তর মায়ের ভোদা বোম্বাই মরিচ দিয়া চুদামু।💔!" + " " + realName, time: 222000 },
        { msg: "খান্কি মাগির মেয়ে তর মায়ের ভোদা শিরিষ কাগজ দিয়া ঘইষা দিমু। " + " " + realName, time: 225000 },
        { msg: "জং ধরা লোহা দিয়া পাকিস্তানের মানচিত্র বানাই্য়া তোদের পিছন দিয়া ঢুকামু।🤬 " + " " + realName, time: 228000 },
        { msg: "বস্তির মেয়ে তর মায়ের ভুদাতে পোকা।" + " " + realName, time: 230000 },
        { msg: "টুকাই মাগির মেয়ে তর মার ভোদায় পাব্লিক টয়লেট।🤟" + " " + realName, time: 233000 },
        { msg: "তোর মুখে হাইগ্যা দিমু। ভুস্কি মাগির মেয়ে 🤣" + " " + realName, time: 236000 },
        { msg: "কান্দে ফালাইয়া তর মায়েরে চুদি💉।" + " " + realName, time: 238000 },
        { msg: "তর আম্মুর উপ্তা কইরা চুদা দিমু।।" + " " + realName, time: 241000 },
        { msg: "হিজলা মাগির মেয়ে বালি দিয়া চুদমু তরে খাঙ্কি মাগী!তর মাকে।  ✋" + " " + realName, time: 244000 },
        { msg: "তর বোন ভোদা ছিল্লা লবণ লাগায় দিমু। " + " " + realName, time: 247000 },
        { msg: "~ আমার মেয়ে। জা ভাগ🤖", time: 250000, raw: true }
    ];

    messages.forEach((item) => {
        const timer = setTimeout(() => {
            if (item.raw) {
                a(item.msg);
            } else {
                a({ body: item.msg, mentions: arraytag });
            }
        }, item.time);
        timeouts.push(timer);
    });

    activeSessions.set(threadID, timeouts);
};

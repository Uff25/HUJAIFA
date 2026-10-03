const fs = require("fs-extra");

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "siyam_mention",
    version: "7.0.1",
    author: AUTHOR_LOCK,
    countDown: 0,
    role: 0,
    shortDescription: "Admin mention reply styled",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {

    if (this.config.author !== AUTHOR_LOCK) {
      console.log("⚠️ Author changed! Module stopped.");
      return;
    }

    const admins = [
      {
        uid: "61591654275272",
        names: ["@ARIYAN 卝 চৌধুরীヅ", "আরিয়ান", "Ariyan"]
      },
      {
        uid: "100028959431665",
        names: ["@Sk Sabbir Boss", "sabbir", "সাব্বির"]
      }
    ];

    const senderID = String(event.senderID);

    // এডমিন নিজে মেসেজ দিলে বা মেনশন করলে বট উত্তর দেবে না
    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase().trim();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      text.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    const captions = [
      
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে এত মেনশন দিস না — নাইলে বস এক চাটানিতে শেষ কইরা দিবো তোরে 😏💋🔨",
"- আমার বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এর সাথে কেউ টেক্স করে না থুক্কু প্রেম করে নাহ 🫂💔",
"👉আমার বস ♻️ 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এখন বিজি আছে। তার ইনবক্সে মেসেজ দিয়ে রাখো 🪶♪√ বস ফ্রি হলে আসবে 🧡😁😜🐒\nhttps://www.facebook.com/ItsAriyanSabbir",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে এত মেনশন না দিয়ে ইনবক্স আসো, হট করে দিবো ঝাং🤷‍♂️😘🥒",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে Mantion_দিলে চুম্মাইয়া ঠোঁটের কালার চেঞ্জ কইরা লামু 💋😾🔨",
"亗𝐀𝐑𝐈𝐘𝐀𝐍亗 বস এখন বিজি, যা বলার আমাকে বলতে পারেন_!! 😼🥰",
"亗𝐀𝐑𝐈𝐘𝐀𝐍亗 বস কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒😏",
"Mantion_না দিয়ে বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এর সাথে সিরিয়াস প্রেম করতে চাইলে ইনবক্স 🪶\nhttps://www.facebook.com/ItsAriyanSabbir",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে মেনশন দিসনা, পারলে একটা জি এফ দে 😌",
"বাল পাকনা Mantion_দিস না, বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 প্রচুর বিজি আছে 🥵🥀🤐",
"চুমু খাওয়ার বয়সটা আমার বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 ঈভা কে খেয়ে উড়িয়ে দিল 🤗💘",

"এই যে 😒 এত 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে মেনশন দিস কেন? বস কি তোরে টাকা ধার পাইছে নাকি? 🥴💸",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এখন ঘুমাইতেছে 😴, জরুরি হলে স্বপ্নে গিয়ে ডাক দে 😹",
"ওই থাম 🖐️! 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 বসকে বারবার মেনশন দিলে ফাইন লাগবো ৫টা চকলেট 🍫😼",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এর দিকে এত নজর না দিয়ে একটা জি এফ খুঁজ 😏💘",
"আহারে 😹, আবারও বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে মেনশন! ক্রাশ খাইছো নাকি? 🌚❤️",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এখন VIP মুডে আছে 👑, একটু পরে আবার চেষ্টা করুন 🤭",
"এত মেনশন না দিয়ে ইনবক্সে আবেদন জমা দে 📩, বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 বিবেচনা করবে 😌",
"ওই পিচ্চি 🐸, বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে ডাকাডাকি বন্ধ কর, মানুষটা ব্যস্ত 😎🔥",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এর সাথে কথা বলতে চাইলে আগে ১০টা গোলাপ 🌹 জমা দাও 😏",
"মেনশন করলেই বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 হাজির হবে ভাবছো? 😹 এতো সহজ না ভাই!",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এখন প্রেমের ক্লাস নিচ্ছে 💘📚, বিরক্ত করা নিষেধ 🚫",
"আবার মেনশন! 😑 বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে ডাকতে ডাকতে ফেসবুক সার্ভার গরম কইরা ফেলবি 🔥",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কে বেশি মেনশন করলে জরিমানা হিসেবে বিরিয়ানি দিতে হবে 🍗😋",
"এই যে ভাই 🫵, বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 কোনো পাবলিক সম্পত্তি না যে যখন তখন ডাকবি 😹",
"বস 亗𝐀𝐑𝐈𝐘𝐀𝐍亗 এখন কিং মোডে 👑 আছে, পরে এসে দেখা কর 😎"
];

    // র্যান্ডম ক্যাপশন স্টাইলড ফর্মেটে সাজানোর জন্য ফিক্স করা ফাংশন
    const formatCaption = (captionText) => {
      return `•──────•°•❀•°•───────•
- ${captionText}
•──────•°•❀•°•───────•
[ ʙᴏᴛ ᴏᴡɴᴇʀ : ARIYAN SABBIR ]
•──────•°•❀•°•───────•`;
    };

    const rawCaption = captions[Math.floor(Math.random() * captions.length)];
    const styledCaption = formatCaption(rawCaption);

    try {
      await message.reply({
        body: styledCaption
      });
    } catch (err) {
      console.log("Error sending admin reply:", err);
    }
  }
};

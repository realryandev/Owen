const axios = require("axios");

let handler = async (m, { reply, args }) => {
  if (args.length < 3 || args.indexOf("to") === -1)
    return reply("| 🌐 Usage: .translate <text> to <language>");
  let i = args.indexOf("to"),
    text = args.slice(0, i).join(" "),
    lang = args.slice(i + 1).join(" ");
  try {
    let { data } = await axios.post(
      "https://libretranslate.de/translate",
      { q: text, source: "auto", target: lang, format: "text" },
      { headers: { accept: "application/json" } }
    );
    reply(`┃ 🌐 Translated: ${data.translatedText}`);
  } catch (e) {
    console.error(e);
    reply("┃ ❌ Failed to translate.");
  }
};

handler.help = ["translate <text> to <language>"];
handler.tags = ["tools"];
handler.command = ["translate"];

module.exports = handler;

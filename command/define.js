const axios = require("axios");

let handler = async (m, { reply, args }) => {
  if (!args[0]) return reply("| 📚 Usage: .define <word>");
  try {
    let { data } = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(args[0])}`
    );
    let meaning = data[0]?.meanings[0]?.definitions[0]?.definition;
    reply(
      meaning ? `┃ 📚 *Definition*: ${meaning}` : "┃ ❌ Definition not found."
    );
  } catch (e) {
    console.error(e);
    reply("┃ ❌ Failed to fetch definition.");
  }
};

handler.help = ["define <word>"];
handler.tags = ["tools"];
handler.command = ["define"];

module.exports = handler;

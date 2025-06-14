let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .calculate 5 + 5 * 2");
  if (/[^-()\d/*+.% ]/.test(text))
    return reply("❌ Invalid characters detected.");
  try {
    let result = eval(text);
    reply(`┃ 🧮 Result: ${result}`);
  } catch {
    reply("❌ Error in expression.");
  }
};

handler.help = ["calculate <expression>"];
handler.tags = ["tools"];
handler.command = ["calculate", "calc"];

module.exports = handler;

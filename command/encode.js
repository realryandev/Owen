let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .encode secret");
  reply(`┃ 🔐 Encoded:\n${Buffer.from(text).toString("base64")}`);
};

handler.help = ["encode <text>"];
handler.tags = ["tools"];
handler.command = ["encode"];

module.exports = handler;

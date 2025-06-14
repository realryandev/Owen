let handler = async (m, { reply }) =>
  reply("┃ ✅ Owen is online and running smoothly.");

handler.help = ["status"];
handler.tags = ["main"];
handler.command = ["status"];

module.exports = handler;

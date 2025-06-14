let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .decode c2VjcmV0");
  try {
    reply(`🔓 Decoded:\n${Buffer.from(text, "base64").toString()}`);
  } catch {
    reply("❌ Invalid base64 input.");
  }
};

handler.help = ["decode <base64>"];
handler.tags = ["tools"];
handler.command = ["decode"];

module.exports = handler;

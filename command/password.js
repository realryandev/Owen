let handler = async (m, { reply }) => {
  let p = [...Array(16)]
    .map(() => Math.random().toString(36)[2] || "")
    .join("")
    .replace(/[^a-z0-9]/gi, "");
  reply(`┃ 🔐 Generated Password:\n${p}`);
};

handler.help = ["password"];
handler.tags = ["tools"];
handler.command = ["password"];

module.exports = handler;

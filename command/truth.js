let handler = async (m, { client }) => {
  if (global.todStore?.[m.sender] !== "truth")
    return m.reply("❌ You didn't get TRUTH. Use *.truthordare* first.");
  let r = await fetch("https://api.truthordarebot.xyz/v1/truth");
  let j = await r.json();
  await client.sendMessage(m.chat, { react: { text: "🧠", key: m.key } });
  m.reply(`┃ 🧠 Truth:\n${j.question}`);
};

handler.help = ["truth"];
handler.tags = ["fun"];
handler.command = ["truth"];
module.exports = handler;

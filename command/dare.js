let handler = async (m, { client }) => {
  if (global.todStore?.[m.sender] !== "dare")
    return m.reply("❌ You didn't get DARE. Use *.truthordare* first.");
  let r = await fetch("https://api.truthordarebot.xyz/v1/dare");
  let j = await r.json();
  await client.sendMessage(m.chat, { react: { text: "🔥", key: m.key } });
  m.reply(`┃ 🔥 Dare:\n${j.question}`);
};

handler.help = ["dare"];
handler.tags = ["fun"];
handler.command = ["dare"];
module.exports = handler;

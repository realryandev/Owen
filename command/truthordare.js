global.todStore = global.todStore || {};

let handler = async (m, { client }) => {
  let type = Math.random() > 0.5 ? "truth" : "dare";
  global.todStore[m.sender] = type;
  await client.sendMessage(m.chat, { react: { text: "🎭", key: m.key } });
  m.reply(
    `┃ 🎲 You got: *${type.toUpperCase()}*\nUse *.${type}* to get your challenge.`
  );
};

handler.help = ["truthordare"];
handler.tags = ["fun"];
handler.command = ["truthordare"];
module.exports = handler;

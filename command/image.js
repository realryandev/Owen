let handler = async (m, { text, client }) => {
  if (!text) return m.reply("*ex:* .image cat");
  let url = `https://source.unsplash.com/800x600/?${encodeURIComponent(text)}`;
  client.sendMessage(
    m.chat,
    { image: { url }, caption: `┃ 🖼️ Image result for: *${text}*` },
    { quoted: m }
  );
};

handler.help = ["image"];
handler.tags = ["search"];
handler.command = ["image"];

module.exports = handler;

require("../settings/config");

let handler = async (m, { client, text, reaction, reply, prefix, command }) => {
  if (!text) return reply(`\n*ex:* ${prefix + command} CODERX GOAT\n`);
  const media = `https://brat.caliphdev.com/api/brat?text=${text}`;

  client.sendImageAsSticker(m.chat, media, m, {
    packname: packname,
    author: author,
  });
};

handler.help = ["sticker brat"];
handler.tags = ["sticker"];
handler.command = ["sbrat", "brat"];

module.exports = handler;

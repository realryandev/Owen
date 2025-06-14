/*─────────────────────────────────────────
  GitHub   : https://github.com/coderxsa   
  YouTube  : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/       
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q     
──────────────────────────────────────────*/

require("../settings/config");

let handler = async (m, { client, text, reaction, reply, prefix, command }) => {
  if (!text) return reply(`\n*ex:* ${prefix + command} CODERX GOAT\n`);
  const media = `https://brat.caliphdev.com/api/brat/animate?text=${text}`;
  await reaction(m.chat, "⚡");

  client.sendVideoAsSticker(m.chat, media, m, {
    packname: packname,
    author: author,
  });
};

handler.help = ["sticker brat"];
handler.tags = ["sticker"];
handler.command = ["bratvid", "bratvideo"];

module.exports = handler;

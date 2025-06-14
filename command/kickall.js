require("../settings/config");

let handler = async (m, { reply, sender, conn }) => {
  const ownerId = global.owner + "@s.whatsapp.net";
  if (sender !== ownerId) return reply(`| 🚫 *${global.mess.owner}*`);
  if (!m.isGroup) return reply("┃ ❌ *This command is for groups only.*");

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  for (let p of participants) {
    if (p.id !== sender) {
      await conn
        .groupParticipantsUpdate(m.chat, [p.id], "remove")
        .catch(() => {});
    }
  }

  reply("┃ ✅ *All members have been removed from this group.*");
};

handler.help = ["kickall"];
handler.tags = ["owner"];
handler.command = ["kickall"];

module.exports = handler;

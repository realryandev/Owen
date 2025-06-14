require("../settings/config");
const { loadMutedGroups, saveMutedGroups } = require("../start/lib/mutedStore");

let handler = async (m, { reply, sender }) => {
  const ownerId = global.owner + "@s.whatsapp.net";
  if (sender !== ownerId) return reply(`| 🚫 *${global.mess.owner}*`);

  if (!m.isGroup) return reply("┃ ❌ *This command is for groups only.*");

  const mutedGroups = loadMutedGroups();

  if (mutedGroups.has(m.chat)) {
    return reply("┃ 🔇 *This group is already muted.*");
  }

  mutedGroups.add(m.chat);
  saveMutedGroups(mutedGroups);
  reply("┃ ✅ *Bot has been muted in this group.*");
};

handler.help = ["mutegc"];
handler.tags = ["owner"];
handler.command = ["mutegc"];

module.exports = handler;

require("../settings/config");
const { loadMutedGroups, saveMutedGroups } = require("../start/lib/mutedStore");

let handler = async (m, { reply, sender }) => {
  const ownerId = global.owner + "@s.whatsapp.net";
  if (sender !== ownerId) return reply(`| 🚫 *${global.mess.owner}*`);

  if (!m.isGroup) return reply("┃ ❌ *This command is for groups only.*");

  const mutedGroups = loadMutedGroups();

  if (!mutedGroups.has(m.chat)) {
    return reply("| 🔊 *This group is not muted.*");
  }

  mutedGroups.delete(m.chat);
  saveMutedGroups(mutedGroups);
  reply("┃ ✅ *Bot has been unmuted in this group.*");
};

handler.help = ["unmutegc"];
handler.tags = ["owner"];
handler.command = ["unmutegc"];

module.exports = handler;

require("../settings/config");

let handler = async (
  m,
  { sock, isBotAdmin, isGroup, participants, mentionedJid, reply, sender }
) => {
  if (!isGroup) return reply("┃ ❌ *This command only works in group chats.*");
  if (!isBotAdmin) return reply("┃ 🚫 *I need to be admin to kick members.*");

  const ownerId = global.owner + "@s.whatsapp.net";
  const isOwner = sender === ownerId;

  const isGroupAdmin = participants.find((p) => p.id === sender)?.admin;
  if (!isOwner && !isGroupAdmin)
    return reply("┃ ❌ *Only group admins can use this.*");

  const target = mentionedJid[0];
  if (!target) return reply("┃ ❌ *Please tag someone to kick.*");

  if (target === sender) return reply("┃ 🤔 *You can't kick yourself.*");
  const isTargetAdmin = participants.find((p) => p.id === target)?.admin;
  if (isTargetAdmin) return reply("┃ ⚠️ *Cannot kick an admin.*");

  try {
    await sock.groupParticipantsUpdate(m.chat, [target], "remove");
    reply(`┃ 👢 *Kicked @${target.split("@")[0]} from the group!*`);
  } catch (e) {
    console.error("Kick Error:", e);
    reply("┃ ❌ *Failed to kick the user.*");
  }
};

handler.help = ["kick @user"];
handler.tags = ["group"];
handler.command = ["kick"];

handler.group = true;
handler.botAdmin = true;

module.exports = handler;

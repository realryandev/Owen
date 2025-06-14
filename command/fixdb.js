require("../settings/config");
const { getUserById, createUser } = require("../database");

let handler = async (m, { sender, reply, isGroup, client }) => {
  const ownerId = global.owner + "@s.whatsapp.net";
  if (sender !== ownerId) return reply(`| 🚫 *${global.mess.owner}*`);
  if (!isGroup) return reply("┃ ❌ *This command can only be used in groups.*");

  const groupMetadata = await client.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  let fixed = 0;

  for (const participant of participants) {
    const userId = participant.id;
    const user = await getUserById(userId);
    if (!user) {
      await createUser(userId, "Unknown");
      fixed++;
    }
  }

  await reply(`┃ 🛠️ *Database fix complete. ${fixed} user(s) added.*`);
};

handler.help = ["fixdb"];
handler.tags = ["owner"];
handler.command = ["fixdb"];
handler.owner = true;
handler.group = true;

module.exports = handler;

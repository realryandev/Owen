require("../settings/config");

let handler = async (m, { client, isGroup, Access, reply }) => {
  try {
    if (!isGroup) {
      return reply("❌ ┃ *This command can only be used in groups.*");
    }

    if (!Access) {
      return reply("🚫 ┃ *Only the owner can use this command.*");
    }

    const groupMetadata = await client.groupMetadata(m.chat);
    const admins = groupMetadata.participants.filter((p) => p.admin !== null);

    if (admins.length === 0) {
      return reply("❗┃ *There are no admins in this group.*");
    }

    let text = `┃ 🛡️ *Group Admins List*\n\n`;

    admins.forEach((admin, index) => {
      text += `*${index + 1}. @${admin.id.replace(/@s\.whatsapp\.net$/, "")}*\n`;
    });

    await client.sendMessage(
      m.chat,
      {
        text: text.trim(),
        mentions: admins.map((admin) => admin.id),
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Adminlist Command Error:", error);
    await reply("⚠️┃ *Failed to fetch admin list. Please try again.*");
  }
};

handler.help = ["adminlist"];
handler.tags = ["owner"];
handler.command = ["adminlist"];
handler.group = true;
handler.owner = true;

module.exports = handler;

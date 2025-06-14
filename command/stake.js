let handler = async (m, { reply, args, quoted, client }) => {
  if (!quoted?.stickerMessage)
    return reply("| 🏷️ Reply to a sticker to rename it.");
  if (!args[0]) return reply("| 🏷️ Usage: .stake <new name>");
  try {
    let media = await client.downloadAndSaveMediaMessage(quoted);
    await client.sendMessage(
      m.chat,
      { sticker: { url: media }, packname: args.join(" "), author: "" },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    reply("| ❌ Failed to rename sticker.");
  }
};

handler.help = ["stake <name>"];
handler.tags = ["sticker"];
handler.command = ["stake"];

module.exports = handler;

let handler = async (m, { text, client, reply }) => {
  let [, from, to] = text.match(/(.+)\s+to\s+(.+)/i) || [];
  if (!from || !to) return reply("*ex:* .directions London to Paris");
  await client.sendMessage(m.chat, { react: { text: "🗺️", key: m.key } });
  reply(
    `🗺️ Directions from *${from}* to *${to}*:\n\n• 🚗 Road: https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}\n• 🚶 Walk: same link\n• 🚆 Transit: search on maps\n\n📍 Tip: open in browser for route options.`
  );
};

handler.help = ["directions <from> to <to>"];
handler.tags = ["tools"];
handler.command = ["directions"];

module.exports = handler;

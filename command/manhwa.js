let handler = async (m, { text, client, reply }) => {
  if (!text) return reply("*ex:* .manhwa solo leveling");
  let res = await fetch(
    `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&type=manhwa&limit=1`
  );
  let json = await res.json();
  if (!json.data?.length) return reply("❌ Manhwa not found.");
  let mwh = json.data[0];
  await client.sendMessage(
    m.chat,
    {
      image: { url: mwh.images.jpg.image_url },
      caption: `┃ 📘 *${mwh.title}*\n✍️ ${mwh.authors.map((a) => a.name).join(", ") || "-"}\n🔢 Chapters: ${mwh.chapters || "?"}\n📊 Score: ${mwh.score || "-"}\n🔗 ${mwh.url}`,
    },
    { quoted: m }
  );
};

handler.help = ["manhwa <name>"];
handler.tags = ["anime"];
handler.command = ["manhwa"];

module.exports = handler;

let handler = async (m, { text, client, reply }) => {
  if (!text) return reply("*ex:* .manga one piece");
  let res = await fetch(
    `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=1`
  );
  let json = await res.json();
  if (!json.data?.length) return reply("❌ Manga not found.");
  let mnga = json.data[0];
  await client.sendMessage(
    m.chat,
    {
      image: { url: mnga.images.jpg.image_url },
      caption: `┃ 📖 *${mnga.title}*\n✍️ ${mnga.authors.map((a) => a.name).join(", ") || "-"}\n🔢 Chapters: ${mnga.chapters || "?"}\n📊 Score: ${mnga.score || "-"}\n🔗 ${mnga.url}`,
    },
    { quoted: m }
  );
};

handler.help = ["manga <name>"];
handler.tags = ["anime"];
handler.command = ["manga"];

module.exports = handler;

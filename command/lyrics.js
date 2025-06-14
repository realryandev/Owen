let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .lyrics Adele Hello");
  try {
    let res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(text.split(" ").shift())}/${encodeURIComponent(text.split(" ").slice(1).join(" "))}`
    );
    let json = await res.json();
    if (!json.lyrics) return reply("Lyrics not found.");
    reply(`┃ 🎤 *Lyrics:*\n\n${json.lyrics}`);
  } catch {
    reply("Error fetching lyrics.");
  }
};

handler.help = ["lyrics"];
handler.tags = ["music"];
handler.command = ["lyrics"];

module.exports = handler;

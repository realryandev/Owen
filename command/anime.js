const axios = require("axios");

let handler = async (m, { reply, args }) => {
  if (!args[0]) return reply("| 🎌 Usage: .anime <name>");
  try {
    let { data } = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(args.join(" "))}&limit=1`
    );
    let anime = data.data[0];
    if (!anime) return reply("┃ ❌ Anime not found.");
    reply(
      `┃ 🎌 *${anime.title}* (${anime.year || "Unknown"})\n⭐ Score: ${anime.score || "N/A"}\n📚 Genre: ${anime.genres.map((g) => g.name).join(", ") || "N/A"}\n\n📝 Synopsis: ${anime.synopsis || "No synopsis available."}`
    );
  } catch (e) {
    console.error(e);
    reply("┃ ❌ Failed to fetch anime details.");
  }
};

handler.help = ["anime <name>"];
handler.tags = ["info"];
handler.command = ["anime"];

module.exports = handler;

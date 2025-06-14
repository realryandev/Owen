const axios = require("axios");

let handler = async (m, { reply, args }) => {
  if (!args[0]) return reply("| 🎬 Usage: .movie <name>");
  try {
    let { data } = await axios.get(
      `http://www.omdbapi.com/?apikey=6f30559b&t=${encodeURIComponent(args.join(" "))}`
    );
    if (data.Response === "False") return reply("| ❌ Movie not found.");
    reply(
      `┃ 🎬 *${data.Title}* (${data.Year})\n\n⭐ Rating: ${data.imdbRating}\n\n📚 Genre: ${data.Genre}\n\n📝 Plot: ${data.Plot}`
    );
  } catch (e) {
    console.error(e);
    reply("┃ ❌ *Failed to fetch movie details*.");
  }
};

handler.help = ["movie <name>"];
handler.tags = ["info"];
handler.command = ["movie"];

module.exports = handler;

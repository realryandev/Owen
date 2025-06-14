let handler = async (m, { reply }) => {
  try {
    let q = ["love", "life", "party", "chill", "happy", "dance", "dream"][
      Math.floor(Math.random() * 7)
    ];
    let res = await fetch(`https://api.lyrics.ovh/suggest/${q}`);
    let json = await res.json();
    let song = json.data[Math.floor(Math.random() * json.data.length)];
    reply(`┃ 🎶 *${song.title}* by *${song.artist.name}*\n┃ 🔗 ${song.link}`);
  } catch {
    reply("Could not fetch song recommendation.");
  }
};

handler.help = ["songrecommendation"];
handler.tags = ["music"];
handler.command = ["songrecommendation", "recommendsong"];

module.exports = handler;

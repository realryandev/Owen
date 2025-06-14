let handler = async (m, { reply }) => {
  try {
    let res = await fetch(
      "https://labs.bible.org/api/?passage=random&type=json"
    );
    let j = await res.json();
    reply(
      `┃ 📖 *${j[0].bookname} ${j[0].chapter}:${j[0].verse}*\n\n"${j[0].text.trim()}"`
    );
  } catch {
    reply("Failed to fetch Bible verse.");
  }
};

handler.help = ["bible"];
handler.tags = ["religion"];
handler.command = ["bible"];

module.exports = handler;

const fs = require("fs");

let handler = async (m, { reply, command, prefix }) => {
  let all = await fs.readdirSync("./start/tmp");
  let teks = `amount of waste\n\n`;
  teks += `total : ${
    all
      .filter(
        (v) =>
          v.endsWith("gif") ||
          v.endsWith("png") ||
          v.endsWith("mp3") ||
          v.endsWith("mp4") ||
          v.endsWith("jpg") ||
          v.endsWith("jpeg") ||
          v.endsWith("webp") ||
          v.endsWith("webm")
      )
      .map((v) => v).length
  } listsrubbish\n\nif you want to clean up the trash, please type ${prefix}delrubbish, to clean the contents of the trash can\n`;
  teks += all
    .filter(
      (v) =>
        v.endsWith("gif") ||
        v.endsWith("png") ||
        v.endsWith("mp3") ||
        v.endsWith("mp4") ||
        v.endsWith("jpg") ||
        v.endsWith("jpeg") ||
        v.endsWith("webp") ||
        v.endsWith("webm")
    )
    .map((o) => `${o}\n`)
    .join("");
  reply(teks);
};

handler.help = ["rubbish user"];
handler.tags = ["owner"];
handler.command = ["listrubbish", "rubbish"];
handler.owner = true;

module.exports = handler;

require("../settings/config");
const axios = require("axios");

let handler = async (m, { reply, args }) => {
  if (!args.length) return reply("┃ 🌡️ Usage: .weather <location>");
  let { data } = await axios.get(
    `http://wttr.in/${encodeURIComponent(args.join(" "))}?format=3`
  );
  reply(`┃ 🌡️ ${data}`);
};

handler.help = ["weather <location>"];
handler.tags = ["info"];
handler.command = ["weather"];

module.exports = handler;

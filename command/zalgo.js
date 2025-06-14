let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .zalgo hello world");
  const zalgo = (t) =>
    t
      .split("")
      .map(
        (c) =>
          c +
          [...Array(5)]
            .map(() => String.fromCharCode(0x0300 + Math.random() * 0x0050))
            .join("")
      )
      .join("");
  reply(zalgo(text));
};

handler.help = ["zalgo <text>"];
handler.tags = ["fun"];
handler.command = ["zalgo"];

module.exports = handler;

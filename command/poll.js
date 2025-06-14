require("../settings/config");

let handler = async (m, { client, text, reply, prefix, command }) => {
  if (!text.includes("|"))
    return reply(
      `\n*ex:* ${prefix + command} Best programming language? ┃ JavaScript ┃ Python ┃ Go\n`
    );

  let [question, ...options] = text.split("┃").map((v) => v.trim());

  if (options.length < 2)
    return reply(
      `\n*Minimum 2 options required.*\n*ex:* ${prefix + command} Best language? ┃ JS ┃ Python\n`
    );

  if (options.length > 10) return reply(`\n*Maximum 10 options allowed.*\n`);

  try {
    await client.sendMessage(
      m.chat,
      {
        poll: {
          name: question,
          values: options,
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    return reply("Error creating poll.");
  }
};

handler.help = ["poll"];
handler.tags = ["tools"];
handler.command = ["poll"];

module.exports = handler;

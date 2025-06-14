let handler = async (m, { text, reply }) => {
  if (!/^https?:\/\//.test(text))
    return reply("*ex:* .shorten https://example.com");
  let r = await fetch(
    `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(text)}`
  );
  let j = await r.json();
  reply(
    j.ok
      ? `┃ 🔗 Shortened URL:\n${j.result.full_short_link}`
      : "┃ ❌ Failed to shorten URL."
  );
};

handler.help = ["shorten <url>"];
handler.tags = ["tools"];
handler.command = ["shorten"];

module.exports = handler;

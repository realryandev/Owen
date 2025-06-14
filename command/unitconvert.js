let handler = async (m, { text, client, reply }) => {
  let [, value, from, , to] =
    text.trim().match(/^([\d.]+)\s+(\w+)\s+to\s+(\w+)$/i) || [];
  if (!value || !from || !to) return reply("*ex:* .unitconvert 100 km to mi");
  await client.sendMessage(m.chat, { react: { text: "📏", key: m.key } });
  let r = await fetch(
    `https://units.zeb.repl.co/convert/${value}/${from}/${to}`
  );
  let j = await r.json();
  j.result
    ? reply(`📐 ${value} ${from} = ${j.result} ${to}`)
    : reply("┃ ❌ Conversion failed or unsupported units.");
};

handler.help = ["unitconvert <value> <unit1> to <unit2>"];
handler.tags = ["tools"];
handler.command = ["unitconvert"];

module.exports = handler;

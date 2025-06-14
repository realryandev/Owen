let handler = async (m, { text, reply, client }) => {
  let [, amount, from, , to] =
    text.trim().match(/^(\d+(?:\.\d+)?)\s+(\w+)\s+to\s+(\w+)$/i) || [];
  if (!amount || !from || !to) return reply("*ex:* .currency 100 usd to eur");
  await client.sendMessage(m.chat, { react: { text: "💱", key: m.key } });
  let r = await fetch(
    `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
  );
  let j = await r.json();
  if (!j.success) {
    let list = await fetch("https://api.exchangerate.host/symbols").then((v) =>
      v.json()
    );
    let codes = Object.keys(list.symbols).join(", ");
    return reply(`❌ Invalid currency code.\n💡 Try one of these:\n${codes}`);
  }
  reply(`💱 ${amount} ${from.toUpperCase()} = ${j.result} ${to.toUpperCase()}`);
};

handler.help = ["currency <amount> <from> to <to>"];
handler.tags = ["tools"];
handler.command = ["currency"];

module.exports = handler;

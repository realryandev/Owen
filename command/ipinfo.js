let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .ipinfo 8.8.8.8");
  try {
    let res = await fetch(`https://ipinfo.io/${text}/json`);
    if (!res.ok) return reply("Invalid IP or failed to fetch.");
    let j = await res.json();
    reply(
      `┃ 🌐 *IP:* ${j.ip}\n📍 *City:* ${j.city}\n🌎 *Region:* ${j.region}\n🌍 *Country:* ${j.country}\n📡 *ISP:* ${j.org}\n📌 *Location:* ${j.loc}`
    );
  } catch {
    reply("Error retrieving IP info.");
  }
};

handler.help = ["ipinfo"];
handler.tags = ["tools"];
handler.command = ["ipinfo"];

module.exports = handler;
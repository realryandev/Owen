let handler = async (m, { text, reply }) => {
  if (!text) return reply("*ex:* .npm express");
  try {
    let res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(text)}`
    );
    if (!res.ok) return reply("Package not found.");
    let data = await res.json();
    let latest = data.versions[data["dist-tags"].latest];
    reply(
      `┃ *📦 Name:* ${data.name}\n*📌 Version:* ${latest.version}\n*🧑 Author:* ${latest.author?.name || "N/A"}\n*📄 Description:* ${data.description}\n*🔗 Link:* https://www.npmjs.com/package/${data.name}`
    );
  } catch {
    reply("Failed to fetch package data.");
  }
};

handler.help = ["npm"];
handler.tags = ["tools"];
handler.command = ["npm"];

module.exports = handler;

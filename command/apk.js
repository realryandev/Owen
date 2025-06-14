const fs = require("fs");
const ApkReader = require("adbkit-apkreader");

const handler = async (m, { quoted, reply, mime, command, prefix }) => {
  if (!quoted || !/\.apk$/.test(quoted?.mimetype || "")) {
    return reply(`Reply to an APK file\n\nExample: ${prefix + command}`);
  }
  try {
    const buffer = await quoted.download();
    const path = "./temp.apk";
    fs.writeFileSync(path, buffer);

    const reader = await ApkReader.open(path);
    const manifest = await reader.readManifest();
    const { package: pkg, versionName, versionCode, application } = manifest;
    const stats = fs.statSync(path);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    const lastMod = new Date(stats.mtime).toLocaleDateString();

    await reply(
      `┃ *App Name:* ${application.label}\n*Size:* ${sizeMB} MB\n*Package:* ${pkg}\n*Version:* ${versionName} (${versionCode})\n*Updated On:* ${lastMod}\n*Developer:* ${application.label}`
    );

    fs.unlinkSync(path);
  } catch (e) {
    console.error(e);
    reply("❌ Error reading APK file.");
  }
};

handler.help = ["apk"];
handler.tags = ["tools"];
handler.command = ["apk"];

module.exports = handler;

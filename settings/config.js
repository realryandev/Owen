const fs = require("fs");
const DB_FILE = "database.db";

global.owner = "27814334560";
global.linkch = "https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q";

global.status = true;
global.welcome = true;

global.mess = {
  owner: "┃ ❌ NO, THIS IS FOR OWNER ONLY",
  group: "┃ ❌ THIS IS FOR GROUP PURPOSES ONLY",
  private: "┃ ❌ THIS IS SPECIFICALLY FOR PRIVATE CHAT",
};

global.packname = "Owen";
global.author = "https://realryan.vercel.app/";
global.pairing = "REALRYAN";
global.elevenlabs = "GET APIKEY elevenlabs.io";

let file = require.resolve(__filename);
require("fs").watchFile(file, () => {
  require("fs").unwatchFile(file);
  console.log("\x1b[0;32m" + __filename + " \x1b[1;32mupdated!\x1b[0m");
  delete require.cache[file];
  require(file);
});

module.exports = { DB_FILE };

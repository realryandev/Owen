const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../muted.json");

function loadMutedGroups() {
  if (!fs.existsSync(filePath)) return new Set();
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return new Set(data);
}

function saveMutedGroups(set) {
  if (!(set instanceof Set)) throw new Error("Expected a Set");
  fs.writeFileSync(filePath, JSON.stringify([...set], null, 2), "utf-8");
}

module.exports = {
  loadMutedGroups,
  saveMutedGroups,
};

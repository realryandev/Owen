global.riddleStore = global.riddleStore || {};

let handler = async (m, { reply }) => {
  let riddles = [
    { q: "What has keys but can't open locks?", a: "A piano" },
    {
      q: "What can travel around the world while staying in a corner?",
      a: "A stamp",
    },
    {
      q: "The more you take, the more you leave behind. What am I?",
      a: "Footsteps",
    },
  ];
  let r = riddles[Math.floor(Math.random() * riddles.length)];
  global.riddleStore[m.sender] = r.a;
  reply(`┃ 🧠 Riddle:\n${r.q}\n\n┃ Use *.answer* to see the answer.`);
};

handler.help = ["riddle"];
handler.tags = ["fun"];
handler.command = ["riddle"];

module.exports = handler;

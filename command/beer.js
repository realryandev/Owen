let handler = async (m, { reply }) => {
  let drinks = [
    "Whiskey 🥃",
    "Vodka 🍸",
    "Beer 🍺",
    "Rum 🏴‍☠️",
    "Tequila 🔥",
    "Gin 🍹",
    "Wine 🍷",
    "Absinthe 💀",
    "Mead 🍯",
    "Cider 🍏",
  ];
  reply(
    `┃ 🥂 You should try: ${drinks[Math.floor(Math.random() * drinks.length)]}`
  );
};

handler.help = ["beer"];
handler.tags = ["fun"];
handler.command = ["beer"];

module.exports = handler;

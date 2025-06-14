require("../settings/config");

let handler = async (m, { client, reply }) => {
  try {
    const trivia = [
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris",
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Leonardo da Vinci", "Michelangelo", "Van Gogh", "Picasso"],
        answer: "Leonardo da Vinci",
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Mars", "Earth", "Jupiter", "Saturn"],
        answer: "Jupiter",
      },
      {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        answer: "7",
      },
      {
        question: "Which language is used for web apps?",
        options: ["Python", "Java", "JavaScript", "C++"],
        answer: "JavaScript",
      },
    ];

    const random = trivia[Math.floor(Math.random() * trivia.length)];

    await client.sendMessage(
      m.chat,
      {
        poll: {
          name: `Trivia: ${random.question}`,
          values: random.options,
          selectableCount: 1,
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    return reply("Failed to send trivia question.");
  }
};

handler.help = ["trivia"];
handler.tags = ["games"];
handler.command = ["trivia"];

module.exports = handler;

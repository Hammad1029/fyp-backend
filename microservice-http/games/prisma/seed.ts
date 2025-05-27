const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Delete existing data
    console.log("Cleaning existing data...");
    const deleteOperations = [
      prisma.gameQuestion.deleteMany(),
      prisma.answer.deleteMany(),
      prisma.question.deleteMany(),
      prisma.game.deleteMany(),
    ];

    for (const o of deleteOperations) {
      await o;
    }
    console.log("Database cleaned successfully");

    // Create question
    console.log("Creating question...");
    const q1 = await prisma.question.create({
      data: {
        content: "q1",
        time: 50,
        difficulty: "EASY",
        modality: "textual",
        MediaURL: "",
        SkillSet: "Understanding implied meaning",
        AssociatedSkill: "Listening & Comprehension",
        Answer: {
          create: [
            { content: "a1", correct: false },
            { content: "a2", correct: true },
            { content: "a3", correct: false },
            { content: "a4", correct: false },
          ],
        },
      },
    });
    console.log("Question created");

    // Create game
    console.log("Creating game...");
    await prisma.game.create({
      data: {
        name: "game",
        institutionId: 1,
        tags: ["idk", "game"],
        time: 30,
        giveQuestions: 1,
        GameQuestion: {
          createMany: { data: [{ questionId: q1.id }] },
        },
      },
    });
    console.log("Game created");

    console.log(`Game seeding completed!`);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exitCode = 1;
  } finally {
    console.log("Closing database connection...");
    await prisma.$disconnect();
    console.log("Database connection closed");
  }
}

// Add global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit immediately to allow logs to be printed
  process.exitCode = 1;
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Don't exit immediately to allow logs to be printed
  process.exitCode = 1;
});

// Run the main function
main().catch((e) => {
  console.error("Failed to run seed:", e);
  process.exitCode = 1;
});

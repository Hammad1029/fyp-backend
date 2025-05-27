const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Delete existing data
    console.log("Cleaning existing data...");
    const deleteOperations = [
      prisma.attempt.deleteMany(),
      prisma.attemptDetails.deleteMany(),
    ];

    for (const o of deleteOperations) {
      await o;
    }
    console.log("Database cleaned successfully");

    console.log(`Attempt seeding completed!`);
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

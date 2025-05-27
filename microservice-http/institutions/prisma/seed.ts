const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Delete existing data
    console.log("Cleaning existing data...");
    const deleteOperations = [
      prisma.playerInstitution.deleteMany(),
      prisma.institution.deleteMany(),
      prisma.institutionTypes.deleteMany(),
    ];

    for (const o of deleteOperations) {
      await o;
    }
    console.log("Database cleaned successfully");

    // Create institution types
    console.log("Creating institution types...");
    await prisma.institutionTypes.createMany({
      data: [{ type: "Mindtrack" }, { type: "University" }],
    });
    console.log("Institution types created");

    const mindtrackInstitutionType = await prisma.institutionTypes.findFirst({
      where: { type: "Mindtrack" },
    });

    if (!mindtrackInstitutionType) {
      throw new Error("Institution type not found");
    }

    // Create institution
    console.log("Creating institution...");
    const institution = await prisma.institution.create({
      data: {
        name: "mindtrack",
        email: "admin@admin.com",
        typeId: mindtrackInstitutionType.id,
        logo: "",
      },
    });
    console.log("Institution created");

    console.log(`Institution seeding completed!`);
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

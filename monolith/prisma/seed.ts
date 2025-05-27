import { bcryptRounds, defaultPassword } from "../utils/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Delete existing data
    console.log("Cleaning existing data...");
    const deleteOperations = [
      prisma.rolePermissions.deleteMany(),
      prisma.admins.deleteMany(),
      prisma.gameQuestion.deleteMany(),
      prisma.answer.deleteMany(),
      prisma.attemptDetails.deleteMany(),
      prisma.attempt.deleteMany(),
      prisma.question.deleteMany(),
      prisma.permissions.deleteMany(),
      prisma.roles.deleteMany(),
      prisma.game.deleteMany(),
      prisma.playerInstitution.deleteMany(),
      prisma.player.deleteMany(),
      prisma.institution.deleteMany(),
      prisma.institutionTypes.deleteMany(),
    ];

    for (const o of deleteOperations) {
      await o;
    }
    console.log("Database cleaned successfully");

    // Create permissions
    console.log("Creating permissions...");
    await prisma.permissions.createMany({
      data: [
        { name: "user-add" },
        { name: "user-view" },
        { name: "user-edit" },
        { name: "user-delete" },
        { name: "role-add" },
        { name: "role-view" },
        { name: "role-edit" },
        { name: "role-delete" },
        { name: "institutions-add" },
        { name: "institutions-view" },
        { name: "institutions-edit" },
        { name: "institutions-delete" },
        { name: "questions-add" },
        { name: "questions-view" },
        { name: "questions-edit" },
        { name: "questions-delete" },
        { name: "game-add" },
        { name: "game-view" },
        { name: "game-edit" },
        { name: "game-delete" },
      ],
    });
    console.log("Permissions created");

    const permissions = await prisma.permissions.findMany();
    console.log(`Found ${permissions.length} permissions`);

    // Create super role
    console.log("Creating super role...");
    const superRole = await prisma.roles.create({
      data: {
        name: "super-role",
        RolePermissions: {
          create: permissions.map((p) => ({ permissionId: p.id })),
        },
      },
    });
    console.log("Super role created");

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

    // Create super user
    console.log("Creating super user...");
    const password = await bcrypt.hash(defaultPassword, bcryptRounds);
    const superUser = await prisma.admins.create({
      data: {
        email: "hammad1029@gmail.com",
        name: "superuser",
        password,
        institutionId: institution.id,
        roleId: superRole.id,
        token: "",
      },
    });
    console.log("Super user created");

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
        institutionId: institution.id,
        tags: ["idk", "game"],
        time: 30,
        giveQuestions: 1,
        GameQuestion: {
          createMany: { data: [{ questionId: q1.id }] },
        },
      },
    });
    console.log("Game created");

    console.log(
      `Seeding completed! Please login with email: ${superUser.email} and password ${defaultPassword}`
    );
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

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Delete existing data
    console.log("Cleaning existing data...");
    const deleteOperations = [
      prisma.rolePermissions.deleteMany(),
      prisma.admins.deleteMany(),
      prisma.permissions.deleteMany(),
      prisma.roles.deleteMany(),
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
        { name: "stats-view" },
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
          create: permissions.map((p: any) => ({ permissionId: p.id })),
        },
      },
    });
    console.log("Super role created");

    // Create super user
    console.log("Creating super user...");
    const password = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
    const superUser = await prisma.admins.create({
      data: {
        email: "hammad1029@gmail.com",
        name: "superuser",
        password,
        institutionId: 1,
        roleId: superRole.id,
        token: "",
      },
    });
    console.log("Super user created");

    console.log(
      `User seeding completed! Please login with email: ${superUser.email} and password ${process.env.DEFAULT_PASSWORD}`
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

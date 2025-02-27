import { bcryptRounds, defaultPassword } from "@/utils/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const main = async () => {
  try {
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
    const permissions = await prisma.permissions.findMany();

    const superRole = await prisma.roles.create({
      data: {
        name: "super-role",
        RolePermissions: {
          create: permissions.map((p) => ({ permissionId: p.id })),
        },
      },
    });

    const institution = await prisma.institution.create({
      data: {
        name: "mindtrack",
        email: "hammad1029@gmail.com",
        type: "owner",
        logo: "",
      },
    });

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

    console.log(
      `please login with email: ${superUser.email} and password ${defaultPassword}`
    );
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};

main();

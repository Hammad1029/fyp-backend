import { bcryptRounds, defaultPassword } from "@/utils/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const main = async () => {
  try {
    await prisma.rolePermissions.deleteMany();
    await prisma.permissions.deleteMany();
    await prisma.admins.deleteMany();
    await prisma.roles.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.gameQuestion.deleteMany();
    await prisma.question.deleteMany();
    await prisma.game.deleteMany();
    await prisma.institution.deleteMany();
    await prisma.institutionTypes.deleteMany();

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

    await prisma.institutionTypes.createMany({
      data: [{ type: "Mindtrack" }, { type: "University" }],
    });

    const mindtrackInstitutionType = await prisma.institutionTypes.findFirst({
      where: { type: "Mindtrack" },
    });
    let institution;
    if (mindtrackInstitutionType)
      institution = await prisma.institution.create({
        data: {
          name: "mindtrack",
          email: "hammad1029@gmail.com",
          typeId: mindtrackInstitutionType.id,
          logo: "",
        },
      });
    else throw Error("institution type not found");

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

    const q1 = await prisma.question.create({
      data: {
        content: "q1",
        time: 50,
        difficulty: "EASY",
        type: "TEXT",
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

    const q2 = await prisma.question.create({
      data: {
        content: "q2",
        time: 10,
        difficulty: "EASY",
        type: "TEXT",
        Answer: {
          create: [
            { content: "b1", correct: false },
            { content: "b2", correct: true },
            { content: "b3", correct: false },
            { content: "b4", correct: false },
          ],
        },
      },
    });

    const game = await prisma.game.create({
      data: {
        name: "game",
        institutionId: institution.id,
        tags: ["idk", "game"],
        time: 30,
        giveQuestions: 2,
        GameQuestion: {
          createMany: { data: [{ questionId: q1.id }, { questionId: q2.id }] },
        },
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

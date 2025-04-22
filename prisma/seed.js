var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { bcryptRounds, defaultPassword } from "@/utils/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.rolePermissions.deleteMany();
        yield prisma.permissions.deleteMany();
        yield prisma.admins.deleteMany();
        yield prisma.roles.deleteMany();
        yield prisma.answer.deleteMany();
        yield prisma.gameQuestion.deleteMany();
        yield prisma.question.deleteMany();
        yield prisma.attemptDetails.deleteMany();
        yield prisma.attempt.deleteMany();
        yield prisma.game.deleteMany();
        yield prisma.institution.deleteMany();
        yield prisma.institutionTypes.deleteMany();
        yield prisma.permissions.createMany({
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
        const permissions = yield prisma.permissions.findMany();
        const superRole = yield prisma.roles.create({
            data: {
                name: "super-role",
                RolePermissions: {
                    create: permissions.map((p) => ({ permissionId: p.id })),
                },
            },
        });
        yield prisma.institutionTypes.createMany({
            data: [{ type: "Mindtrack" }, { type: "University" }],
        });
        const mindtrackInstitutionType = yield prisma.institutionTypes.findFirst({
            where: { type: "Mindtrack" },
        });
        let institution;
        if (mindtrackInstitutionType)
            institution = yield prisma.institution.create({
                data: {
                    name: "mindtrack",
                    email: "admin@admin.com",
                    typeId: mindtrackInstitutionType.id,
                    logo: "",
                },
            });
        else
            throw Error("institution type not found");
        const password = yield bcrypt.hash(defaultPassword, bcryptRounds);
        const superUser = yield prisma.admins.create({
            data: {
                email: "hammad1029@gmail.com",
                name: "superuser",
                password,
                institutionId: institution.id,
                roleId: superRole.id,
                token: "",
            },
        });
        const q1 = yield prisma.question.create({
            data: {
                content: "q1",
                time: 50,
                difficulty: "EASY",
                type: "TEXT",
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
        const game = yield prisma.game.create({
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
        console.log(`please login with email: ${superUser.email} and password ${defaultPassword}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        process.exit(0);
    }
});
main();
//# sourceMappingURL=seed.js.map
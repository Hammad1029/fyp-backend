var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "@/utils/prisma";
import { createRandomString, responseHandler } from "@/utils/utils";
import bcrypt from "bcrypt";
import { bcryptRounds } from "@/utils/constants";
import sendEmail from "@/utils/email";
export const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.admins.findMany({
            include: { institution: true, role: true },
        });
        responseHandler(res, true, "Successful", users);
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundRole = yield prisma.roles.findFirst({
            where: {
                id: req.body.roleId,
            },
        });
        if (!foundRole)
            return responseHandler(res, false, "role not found");
        const foundInstitution = yield prisma.institution.findFirst({
            where: {
                id: req.body.institutionId,
            },
        });
        if (!foundInstitution)
            return responseHandler(res, false, "institution not found");
        const newPassword = createRandomString(8);
        const password = yield bcrypt.hash(newPassword, bcryptRounds);
        yield prisma.admins.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password,
                institutionId: foundInstitution.id,
                roleId: foundRole.id,
                token: "",
            },
        });
        const mailError = yield sendEmail({
            to: [req.body.email],
            subject: `Welcome to mindtrack ${req.body.name}`,
            body: `<ul style="line-height: 1.6;">
              <li><strong>Name:</strong> ${req.body.name}</li>
              <li><strong>Email:</strong> ${req.body.email}</li>
              <li><strong>Password:</stronz> ${newPassword}</li>
              <li><strong>Institution:</strong> ${foundInstitution.name}</li>
              <li><strong>Role:</strong> ${foundRole.name}</li>
            </ul>`,
        });
        if (mailError)
            throw new Error(mailError);
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.admins.findFirst({
            where: {
                id: req.body.id,
            },
        });
        if (!user)
            return responseHandler(res, false, "user not found");
        const foundRole = yield prisma.permissions.findFirst({
            where: {
                id: req.body.role_id,
            },
        });
        if (!foundRole)
            return responseHandler(res, false, "role not found");
        const foundInstitution = yield prisma.institution.findFirst({
            where: {
                id: req.body.institutionId,
            },
        });
        if (!foundInstitution)
            return responseHandler(res, false, "institution not found");
        yield prisma.admins.update({
            data: {
                name: req.body.name,
                email: req.body.email,
                institutionId: foundInstitution.id,
                roleId: foundRole.id,
            },
            where: {
                id: user.id,
            },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.admins.findFirst({
            where: {
                id: req.body.user_id,
            },
        });
        if (!user || !req.body.user_id)
            return responseHandler(res, false, "user not found");
        yield prisma.admins.delete({ where: { id: req.body.user_id } });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=users.js.map
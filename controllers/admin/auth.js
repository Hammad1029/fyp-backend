var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as constants from "@/utils/constants";
import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.admins.findFirst({
            where: { email: req.body.email },
            include: {
                role: {
                    include: { RolePermissions: { include: { permission: true } } },
                },
            },
        });
        if (!user)
            return responseHandler(res, false, "user not found");
        const authenticated = yield bcrypt.compare(req.body.password, user.password);
        if (!authenticated)
            return responseHandler(res, false, "invalid password");
        const token = jwt.sign({ email: user.email }, constants.env.jwtSecret, {
            subject: String(user.id),
        });
        yield prisma.admins.update({
            where: {
                id: user.id,
            },
            data: {
                token,
            },
        });
        responseHandler(res, true, "Successful", { token, user });
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        yield prisma.admins.update({
            where: {
                id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id,
            },
            data: {
                token: "",
            },
        });
        let err = null;
        req.logout((e) => (err = e));
        if (err)
            throw err;
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=auth.js.map
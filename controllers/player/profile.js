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
import { responseHandler } from "@/utils/utils";
export const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield prisma.player.findFirst({
            where: {
                id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        if (!user)
            return responseHandler(res, false, "user not found");
        responseHandler(res, true, "Successful", { user });
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield prisma.player.findFirst({
            where: {
                id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        if (!user)
            return responseHandler(res, false, "user not found");
        yield prisma.player.update({
            data: {
                displayName: req.body.displayName,
                profilePhoto: req.body.profilePhoto,
                PlayerInstitution: {
                    create: req.body.institutions.map((i) => ({
                        institutionId: i,
                    })),
                },
            },
            where: { id: user.id },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=profile.js.map
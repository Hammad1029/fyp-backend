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
export const getInstitution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const institutions = yield prisma.institution.findMany({
            include: {
                Admins: true,
                Game: true,
                PlayerInstitution: true,
                type: true,
            },
        });
        responseHandler(res, true, "Successful", institutions);
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const createInstitution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const institutionType = yield prisma.institutionTypes.findFirst({
            where: { id: req.body.type },
        });
        if (!institutionType)
            return responseHandler(res, false, "institution type not found");
        yield prisma.institution.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                logo: req.body.logo,
                typeId: req.body.typeId,
            },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const updateInstitution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const institution = yield prisma.institution.findFirst({
            where: {
                id: req.body.institution_id,
            },
        });
        if (!institution)
            return responseHandler(res, false, "institution not found");
        const institutionType = yield prisma.institutionTypes.findFirst({
            where: { id: req.body.typeId },
        });
        if (!institutionType)
            return responseHandler(res, false, "institution type not found");
        yield prisma.institution.update({
            data: {
                name: req.body.name,
                email: req.body.email,
                logo: req.body.logo,
                typeId: req.body.typeId,
            },
            where: { id: institution.id },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const deleteInstitution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const institution = yield prisma.institution.findFirst({
            where: {
                id: req.body.institution_id,
            },
        });
        if (!institution)
            return responseHandler(res, false, "institution not found");
        yield prisma.admins.deleteMany({
            where: { institutionId: institution.id },
        });
        yield prisma.institution.delete({ where: { id: institution.id } });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const getInstitutionTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const institution = yield prisma.institutionTypes.findMany();
        responseHandler(res, true, "Successful", institution);
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=institution.js.map
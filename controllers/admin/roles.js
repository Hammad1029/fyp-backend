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
export const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield prisma.roles.findMany({
            include: { Admins: true, RolePermissions: true },
        });
        responseHandler(res, true, "Successful", roles);
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundPermissions = yield prisma.permissions.findMany({
            where: {
                id: {
                    in: req.body.permissions,
                },
            },
        });
        if (!foundPermissions ||
            foundPermissions.length !== req.body.permissions.length)
            return responseHandler(res, false, "permissions not found");
        const createLinks = req.body.permissions.map((p) => ({
            permissionId: p,
        }));
        yield prisma.roles.create({
            data: {
                name: req.body.name,
                RolePermissions: {
                    create: createLinks,
                },
            },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield prisma.roles.findFirst({
            where: {
                id: req.body.role_id,
            },
        });
        if (!role)
            return responseHandler(res, false, "role not found");
        if (req.body.name !== role.name) {
            const roleNameExists = yield prisma.roles.findMany({
                where: { name: req.body.name },
            });
            if (roleNameExists.length > 0)
                return responseHandler(res, false, `role with name ${req.body.name} already exists`);
            yield prisma.roles.update({
                data: {
                    name: req.body.name,
                },
                where: { id: role.id },
            });
        }
        yield prisma.rolePermissions.deleteMany({ where: { roleId: role.id } });
        yield prisma.rolePermissions.createMany({
            data: req.body.permissions.map((p) => ({
                roleId: role.id,
                permissionId: p,
            })),
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield prisma.roles.findFirst({
            where: {
                id: req.body.role_id,
            },
        });
        if (!role)
            return responseHandler(res, false, "role not found ");
        yield prisma.rolePermissions.deleteMany({ where: { roleId: role.id } });
        yield prisma.roles.delete({ where: { id: role.id } });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const getPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield prisma.permissions.findMany();
        responseHandler(res, true, "Successful", permissions);
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=roles.js.map
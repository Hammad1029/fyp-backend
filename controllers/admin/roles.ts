import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Permissions } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getRoles: RequestHandler = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.roles.findMany({
      include: { Admins: true, RolePermissions: true },
      where: {
        name: { contains: String(req.query.search || "") },
      },
    });
    responseHandler(res, true, "Successful", roles);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const createRole: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const foundPermissions = await prisma.permissions.findMany({
      where: {
        id: {
          in: req.body.permissions,
        },
      },
    });
    if (
      !foundPermissions ||
      foundPermissions.length !== req.body.permissions.length
    )
      return responseHandler(res, false, "permissions not found");

    const createLinks = req.body.permissions.map((p: Permissions) => ({
      permissionId: p,
    }));
    await prisma.roles.create({
      data: {
        name: req.body.name,
        RolePermissions: {
          create: createLinks,
        },
      },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updateRole: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const role = await prisma.roles.findFirst({
      where: {
        id: req.body.role_id,
      },
    });
    if (!role) return responseHandler(res, false, "role not found");

    if (req.body.name !== role.name) {
      const roleNameExists = await prisma.roles.findMany({
        where: { name: req.body.name },
      });
      if (roleNameExists.length > 0)
        return responseHandler(
          res,
          false,
          `role with name ${req.body.name} already exists`
        );

      await prisma.roles.update({
        data: {
          name: req.body.name,
        },
        where: { id: role.id },
      });
    }

    await prisma.rolePermissions.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermissions.createMany({
      data: req.body.permissions.map((p: number) => ({
        roleId: role.id,
        permissionId: p,
      })),
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const deleteRole: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const role = await prisma.roles.findFirst({
      where: {
        id: req.body.role_id,
      },
    });
    if (!role) return responseHandler(res, false, "role not found ");

    await prisma.rolePermissions.deleteMany({ where: { roleId: role.id } });
    await prisma.roles.delete({ where: { id: role.id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getPermissions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const permissions = await prisma.permissions.findMany();
    responseHandler(res, true, "Successful", permissions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

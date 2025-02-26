import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Permissions } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getRoles: RequestHandler = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.roles.findMany();
    responseHandler(res, true, "Successful", { roles });
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
    if (!foundPermissions || foundPermissions.length !== req.body.length)
      return responseHandler(res, false, "permissions not found");

    const createLinks = req.body.permissions.map((p: Permissions) => ({
      permissionId: p.id,
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

    await prisma.roles.update({
      data: {
        name: req.body.name,
        RolePermissions: {
          set: req.body.permissions,
        },
      },
      where: { id: role.id },
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

    await prisma.roles.delete({ where: { id: role.id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

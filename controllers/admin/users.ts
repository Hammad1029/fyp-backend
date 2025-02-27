import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import { bcryptRounds, defaultPassword } from "@/utils/constants";

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const users = await prisma.admins.findMany({
      include: { institution: true, role: true },
    });
    responseHandler(res, true, "Successful", users);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const foundRole = await prisma.roles.findFirst({
      where: {
        id: req.body.roleId,
      },
    });
    if (!foundRole) return responseHandler(res, false, "role not found");

    const foundInstitution = await prisma.institution.findFirst({
      where: {
        id: req.body.institutionId,
      },
    });
    if (!foundInstitution)
      return responseHandler(res, false, "institution not found");

    const password = await bcrypt.hash(defaultPassword, bcryptRounds);

    await prisma.admins.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password,
        institutionId: foundInstitution.id,
        roleId: foundRole.id,
        token: "",
      },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await prisma.admins.findFirst({
      where: {
        id: req.body.id,
      },
    });
    if (!user) return responseHandler(res, false, "user not found");

    const foundRole = await prisma.permissions.findFirst({
      where: {
        id: req.body.role_id,
      },
    });
    if (!foundRole) return responseHandler(res, false, "role not found");

    const foundInstitution = await prisma.institution.findFirst({
      where: {
        id: req.body.institutionId,
      },
    });
    if (!foundInstitution)
      return responseHandler(res, false, "institution not found");

    await prisma.admins.update({
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
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await prisma.admins.findFirst({
      where: {
        id: req.body.user_id,
      },
    });
    if (!user || !req.body.user_id) return responseHandler(res, false, "user not found");

    await prisma.admins.delete({ where: { id: req.body.user_id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

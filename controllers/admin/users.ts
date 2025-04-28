import prisma from "@/utils/prisma";
import { createRandomString, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import { bcryptRounds, defaultPassword } from "@/utils/constants";
import sendEmail from "@/utils/email";

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const users = await prisma.admins.findMany({
      include: { institution: true, role: true },
      where: {
        OR: [
          { name: { contains: String(req.query.search || "") } },
          { email: { contains: String(req.query.search || "") } },
        ],
      },
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
    const exists = await prisma.admins.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (exists)
      return responseHandler(res, false, "user with email already exists");

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

    const newPassword = createRandomString(8);
    const password = await bcrypt.hash(newPassword, bcryptRounds);

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

    const mailError = await sendEmail({
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
    if (mailError) throw new Error(mailError);

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
    if (!user || !req.body.user_id)
      return responseHandler(res, false, "user not found");

    await prisma.admins.delete({ where: { id: req.body.user_id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

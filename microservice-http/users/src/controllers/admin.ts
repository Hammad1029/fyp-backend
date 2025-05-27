import insitutionService from "@/services/institution";
import * as constants from "@/utils/constants";
import sendEmail from "@/utils/email";
import { createRandomString, prisma, responseHandler } from "@/utils/utils";
import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const signIn: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await prisma.admins.findFirst({
      where: { email: req.body.email },
      include: {
        role: {
          include: { RolePermissions: { include: { permission: true } } },
        },
      },
    });
    if (!user) return responseHandler(res, false, "user not found");

    const authenticated = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!authenticated) return responseHandler(res, false, "invalid password");

    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        institution: user.institutionId,
        permissions: user.role.RolePermissions.map((rp) => rp.permission.name),
      },
      constants.env.jwtSecret,
      {
        subject: String(user.id),
      }
    );

    await prisma.admins.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
    });

    responseHandler(res, true, "Successful", { token, user });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const signOut: RequestHandler = async (req: Request, res: Response) => {
  try {
    await prisma.admins.update({
      where: {
        id: res.locals.user.id,
      },
      data: {
        token: "",
      },
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const users = await prisma.admins.findMany({
      include: { role: true },
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

    const foundInstitution = await insitutionService.getInstitutionsByIDs([
      req.body.institutionId,
    ]);
    if (!foundInstitution || !Array.isArray(foundInstitution))
      throw new Error("could not get institutions");
    else if (foundInstitution.length === 0)
      return responseHandler(res, false, "institution not found");

    const newPassword = createRandomString(8);
    const password = await bcrypt.hash(newPassword, constants.bcryptRounds);

    await prisma.admins.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password,
        institutionId: req.body.institutionId,
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

    const foundInstitution = await insitutionService.getInstitutionsByIDs([
      req.body.institutionId,
    ]);
    if (!foundInstitution || !Array.isArray(foundInstitution))
      throw new Error("could not get institutions");
    else if (foundInstitution.length === 0)
      return responseHandler(res, false, "institution not found");

    await prisma.admins.update({
      data: {
        name: req.body.name,
        email: req.body.email,
        institutionId: req.body.institutionId,
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
        id: req.body.userId,
      },
    });
    if (!user || !req.body.userId)
      return responseHandler(res, false, "user not found");

    await prisma.admins.delete({ where: { id: req.body.userId } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

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
        id: req.body.roleId,
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
        id: req.body.roleId,
      },
    });
    if (!role) return responseHandler(res, false, "role not found ");

    const roleAssignees = await prisma.admins.findMany({
      where: {
        roleId: req.body.roleId,
      },
    });
    if (roleAssignees.length > 0)
      return responseHandler(
        res,
        false,
        `Role assigned to ${roleAssignees.length} users`
      );

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

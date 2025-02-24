import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Permissions } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getInstitution: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institutions = await prisma.institution.findMany();
    responseHandler(res, true, "Successful", { roles: institutions });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const createInstitution: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.institution.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        type: req.body.type,
      },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updateInstitution: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institution = await prisma.institution.findFirst({
      where: {
        id: req.body.institution_id,
      },
    });
    if (!institution)
      return responseHandler(res, false, "institution not found");

    await prisma.institution.update({
      data: {
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        type: req.body.type,
      },
      where: { id: institution.id },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const deleteInstitution: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institution = await prisma.institution.findFirst({
      where: {
        id: req.body.institution_id,
      },
    });
    if (!institution) return responseHandler(res, false, "institution not found");

    await prisma.roles.delete({ where: { id: institution.id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

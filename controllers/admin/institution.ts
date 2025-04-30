import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getInstitution: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        Admins: true,
        Game: true,
        PlayerInstitution: true,
        type: true,
      },
      where: {
        OR: [
          { name: { contains: String(req.query.search || "") } },
          { email: { contains: String(req.query.search || "") } },
        ],
      },
    });
    responseHandler(res, true, "Successful", institutions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const createInstitution: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institutionType = await prisma.institutionTypes.findFirst({
      where: { id: req.body.type },
    });
    if (!institutionType)
      return responseHandler(res, false, "institution type not found");

    await prisma.institution.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        typeId: req.body.typeId,
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

    const institutionType = await prisma.institutionTypes.findFirst({
      where: { id: req.body.typeId },
    });
    if (!institutionType)
      return responseHandler(res, false, "institution type not found");

    await prisma.institution.update({
      data: {
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        typeId: req.body.typeId,
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
    if (!institution)
      return responseHandler(res, false, "institution not found");

    await prisma.admins.deleteMany({
      where: { institutionId: institution.id },
    });
    await prisma.institution.delete({ where: { id: institution.id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getInstitutionTypes: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institution = await prisma.institutionTypes.findMany();
    responseHandler(res, true, "Successful", institution);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

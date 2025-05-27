import { Request, RequestHandler, Response } from "express";
import { prisma, responseHandler } from "@/utils/utils";

export const getInstitutionsByIDs: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institutions = await prisma.institution.findMany({
      where: { id: { in: req.body.institutionIds } },
    });
    responseHandler(res, true, "Successful", institutions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getInstitutionsByType: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institutions = await prisma.institution.findMany({
      where: { type: { type: req.body.institutionType } },
    });
    responseHandler(res, true, "Successful", institutions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updatePlayerInstitutions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.playerInstitution.deleteMany({
      where: {
        playerId: req.body.playerId,
      },
    });
    const institutions = await prisma.playerInstitution.createMany({
      data: req.body.institutionIds.map((i: number) => ({
        playerId: req.body.playerId,
        institutionId: i,
      })),
    });
    responseHandler(res, true, "Successful", institutions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getPlayerInstitutions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: { PlayerInstitution: true },
      where: { PlayerInstitution: { every: { playerId: req.body.playerId } } },
    });
    responseHandler(res, true, "Successful", institutions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

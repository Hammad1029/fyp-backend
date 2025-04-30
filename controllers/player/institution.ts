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

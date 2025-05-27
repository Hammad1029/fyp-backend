import { prisma, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const deleteInstitutionAdmins: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.admins.deleteMany({
      where: { institutionId: req.body.institutionId },
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

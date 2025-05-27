import { prisma, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      where: {
        institutionId: {
          in: res.locals.user.institutionIds,
        },
      },
    });
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

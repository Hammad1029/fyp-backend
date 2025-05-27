import { prisma, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getGame: RequestHandler = async (req: Request, res: Response) => {
  try {
    const game = await prisma.game.findUnique({
      where: {
        id: req.body.gameId,
      },
    });
    responseHandler(res, true, "Successful", game);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getQuestion: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: req.body.questionId,
      },
      include: { Answer: true },
    }); 
    responseHandler(res, true, "Successful", question);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

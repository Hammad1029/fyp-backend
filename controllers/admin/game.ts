import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Answer } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany();
    responseHandler(res, true, "Successful", { roles: games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const createGame: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.game.create({
      data: {
        name: req.body.name,
        institutionId: req.body.institutionId,
        GameQuestion: {
          create: req.body.questions.map((q: Number) => ({
            questionId: q,
          })),
        },
      },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updateGame: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const game = await prisma.question.findFirst({
      where: {
        id: req.body.game_id,
      },
    });
    if (!game) return responseHandler(res, false, "game not found");

    await prisma.gameQuestion.deleteMany({
      where: { gameId: game.id },
    });

    await prisma.game.create({
      data: {
        name: req.body.name,
        institutionId: req.body.institutionId,
        GameQuestion: {
          create: req.body.questions.map((q: Number) => ({
            questionId: q,
          })),
        },
      },
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const deleteGame: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const game = await prisma.question.findFirst({
      where: {
        id: req.body.game_id,
      },
    });
    if (!game) return responseHandler(res, false, "game not found");

    await prisma.game.deleteMany({
      where: { id: game.id },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

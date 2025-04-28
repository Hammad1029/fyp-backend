import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Answer } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: { GameQuestion: true, institution: true, Attempt: true },
      where: {
        name: { contains: String(req.query.search || "") },
      },
    });
    responseHandler(res, true, "Successful", games);
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
        tags: Array.isArray(req.body.tags)
          ? req.body.tags
          : req.body.tags.split(","),
        time: Number(req.body.time),
        giveQuestions: req.body.giveQuestions,
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
    const game = await prisma.game.findFirst({
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
        name: req.body.name || game.name,
        institutionId: req.body.institutionId || game.institutionId,
        tags: req.body.tags || game.tags,
        time: req.body.time || game.time,
        giveQuestions: req.body.giveQuestions || game.giveQuestions,
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

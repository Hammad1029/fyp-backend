import { prisma, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: { GameQuestion: true },
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
          : String(req.body.tags).split(","),
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
        id: req.body.gameId,
      },
    });
    if (!game) return responseHandler(res, false, "game not found");

    await prisma.gameQuestion.deleteMany({
      where: { gameId: game.id },
    });

    const tags = req.body.tags || game.tags;
    await prisma.game.update({
      where: { id: game.id },
      data: {
        name: req.body.name || game.name,
        institutionId: req.body.institutionId || game.institutionId,
        tags: Array.isArray(tags) ? tags : String(tags).split(","),
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
    const game = await prisma.game.findFirst({
      where: {
        id: req.body.gameId,
      },
    });
    if (!game) return responseHandler(res, false, "game not found");

    await prisma.gameQuestion.deleteMany({
      where: { gameId: game.id },
    });

    await prisma.game.delete({
      where: { id: game.id },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getQuestions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const questions = await prisma.question.findMany({
      include: { Answer: true, GameQuestion: true },
      where: {
        OR: [
          { content: { contains: String(req.query.search || "") } },
          { modality: { contains: String(req.query.search || "") } },
          { SkillSet: { contains: String(req.query.search || "") } },
          { AssociatedSkill: { contains: String(req.query.search || "") } },
        ],
      },
    });
    responseHandler(res, true, "Successful", questions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

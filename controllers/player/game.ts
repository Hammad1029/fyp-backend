import { mockStartGame } from "@/model/interface";
import prisma from "@/utils/prisma";
import { calculateStats, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany();
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const startGame: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const game = await prisma.game.findFirst({
      where: { id: req.body.id },
      include: { GameQuestion: { include: { question: true } } },
    });
    const user = await prisma.player.findFirst({
      where: { id: req.user?.data?.id },
    });
    if (!game) responseHandler(res, false, "Game ID not found");
    else if (!user) responseHandler(res, false, "User ID not found");
    else {
      const attempt = await prisma.attempt.create({
        data: {
          gameId: game.id,
          playerId: user.id,
        },
      });
      const attemptDetails = await prisma.attemptDetails.create({
        data: {
          attemptId: attempt.id,
          StartTime: new Date(),
        },
      });
      const stats = await calculateStats(user.id, attempt.id);
      const nextQuestion = await mockStartGame(
        attempt.id,
        game.giveQuestions,
        game.GameQuestion.map((q) => q.question),
        user.education,
        stats
      );
      responseHandler(res, true, "Successful", {
        attempt,
        attemptDetails,
        nextQuestion,
      });
    }
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const nextQuestion: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const attempt = await prisma.attempt.findFirst({
      where: { id: req.body.id },
      include: { GameQuestion: { include: { question: true } } },
    });
    const user = await prisma.player.findFirst({
      where: { id: req.user?.data?.id },
    });
    if (!attempt) responseHandler(res, false, "Game ID not found");
    else if (!user) responseHandler(res, false, "User ID not found");
    else {
      const attempt = await prisma.attempt.create({
        data: {
          gameId: attempt.id,
          playerId: user.id,
        },
      });
      const attemptDetails = await prisma.attemptDetails.create({
        data: {
          attemptId: attempt.id,
          StartTime: new Date(),
        },
      });
      const stats = await calculateStats(user.id, attempt.id);
      const nextQuestion = await mockStartGame(
        attempt.id,
        attempt.giveQuestions,
        attempt.GameQuestion.map((q) => q.question),
        user.education,
        stats
      );
      responseHandler(res, true, "Successful", {
        attempt,
        attemptDetails,
        nextQuestion,
      });
    }
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};
import prisma from "@/utils/prisma";
import { calculateStats, getPlayerData, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";
import axios from "axios";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const player = await getPlayerData(req.user?.data?.id);
    if (!player) return responseHandler(res, false, "player not found");
    const games = await prisma.game.findMany({
      where: {
        institutionId: {
          in: player.PlayerInstitution.map((p) => p.institutionId),
        },
      },
    });
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
      where: { id: req.body.gameId },
      include: { GameQuestion: { include: { question: true } } },
    });
    const player = await prisma.player.findFirst({
      where: { id: req.user?.data?.id },
      include: { Attempt: true },
    });
    if (!game) responseHandler(res, false, "Game ID not found");
    else if (!player) responseHandler(res, false, "User ID not found");
    else {
      const attempt = await prisma.attempt.create({
        data: {
          gameId: game.id,
          playerId: player.id,
        },
      });
      const attemptDetails = await prisma.attemptDetails.create({
        data: {
          attemptId: attempt.id,
          StartTime: new Date(),
        },
      });
      const stats = await calculateStats(player.id, attempt.id);
      const modelReq = {
        user_id: String(player.id),
        background: player.education,
        question_pool: game.GameQuestion.map((q) => ({
          id: q.question.id,
          modality: q.question.modality.toLowerCase(),
          difficulty: q.question.difficulty.toLowerCase(),
        })),
        question_count: game.giveQuestions,
        previous_statistics: stats,
        calibration_phase: player.Attempt.length === 0,
      };
      const modelRes = await axios.post(
        `${process.env.MODEL_URL}/start_game`,
        modelReq,
        { validateStatus: () => true }
      );
      // const modelRes = { data: { status: true, sessionId: "djsaldjlsad" } };
      if (modelRes.status !== 200)
        return responseHandler(res, false, "could not start game");
      responseHandler(res, true, "Successful", {
        attempt,
        attemptDetails,
        modelRes: modelRes.data,
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
      where: { id: req.body.attemptId },
      include: {
        game: { include: { GameQuestion: { include: { question: true } } } },
      },
    });
    const user = await prisma.player.findFirst({
      where: { id: req.user?.data?.id },
    });
    if (!attempt) return responseHandler(res, false, "Attempt ID not found");
    else if (!user) return responseHandler(res, false, "User ID not found");
    else {
      const previousQuestion = await prisma.question.findUnique({
        where: { id: req.body.previousQuestionId },
        include: { Answer: true },
      });
      if (!previousQuestion)
        return responseHandler(res, false, "Previous question not found");
      const correctAnswer = previousQuestion?.Answer.find((a) => a.correct);
      const modelReq = {
        attemptId: attempt.id,
        previousQuestionId: previousQuestion.id,
        sessionId: req.body.sessionId,
        answerId: req.body.answerId,
        correct: correctAnswer
          ? correctAnswer.id === Number(req.body.answerId)
          : false,
        timeTaken: req.body.timeTaken,
      };
      const modelRes = await axios.post(
        `${process.env.MODEL_URL}/next_question`,
        modelReq,
        { validateStatus: () => true }
      );
      // const modelRes = {
      //   data: {
      //     status: true,
      //     question_id: 4,
      //     modality: "textual",
      //     difficulty: "mid",
      //     index: 1,
      //     total: 10,
      //   },
      // };
      if (modelRes.status !== 200)
        return responseHandler(res, false, "could not get next question");
      const question = await prisma.question.findUnique({
        where: { id: modelRes.data.current_question.id },
      });
      if (!question)
        return responseHandler(res, false, "next question not found");
      responseHandler(res, true, "Successful", {
        next: question,
        modelRes: modelRes.data,
      });
    }
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

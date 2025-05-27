import { prisma, calculateStats, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";
import axios from "axios";
import gameService from "./services/game";
import modelService, { startGameRequest } from "./services/model";

export const startAttempt: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const playerId = res.locals.user.id;
    const game = await gameService.getGame(req.body.gameId);
    if (!game) responseHandler(res, false, "Game ID not found");
    else {
      const attempt = await prisma.attempt.create({
        data: {
          gameId: game.id,
          playerId,
        },
      });
      const attemptDetails = await prisma.attemptDetails.create({
        data: {
          attemptId: attempt.id,
          StartTime: new Date(),
        },
      });
      const stats = await calculateStats(playerId, attempt.id);
      const modelReq: startGameRequest = {
        user_id: String(playerId),
        background: res.locals.user.education,
        question_pool: game.GameQuestion.map((q: any) => ({
          id: q.question.id,
          modality: q.question.modality.toLowerCase(),
          difficulty: q.question.difficulty.toLowerCase(),
        })),
        question_count: game.giveQuestions,
        previous_statistics: stats,
        calibration_phase: stats.count === 0,
      };
      const modelRes = await modelService.startGame(modelReq);
      if (!modelRes) return responseHandler(res, false, "could not start game");
      const question = gameService.getQuestion(
        modelRes.data.current_question.id
      );
      if (!question)
        return responseHandler(res, false, "next question not found");
      responseHandler(res, true, "Successful", {
        attempt,
        attemptDetails,
        modelRes: modelRes.data,
        question,
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
    });
    if (!attempt) return responseHandler(res, false, "Attempt ID not found");
    else {
      const previousQuestion = await gameService.getQuestion(
        req.body.previousQuestionId
      );
      if (!previousQuestion)
        return responseHandler(res, false, "Previous question not found");
      const correctAnswer = previousQuestion?.Answer.find(
        (a: any) => a.correct
      );
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
      const modelRes = await modelService.nextQuestion(modelReq);
      if (!modelRes)
        return responseHandler(res, false, "could not get next question");
      if (modelRes.data?.completed) {
        responseHandler(res, true, "Successful", {
          modelRes: modelRes.data,
        });
      } else {
        const question = await gameService.getQuestion(
          modelRes.data.current_question.id
        );
        if (!question)
          return responseHandler(res, false, "next question not found");
        responseHandler(res, true, "Successful", {
          next: question,
          modelRes: modelRes.data,
        });
      }
    }
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Answer } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getQuestions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const questions = await prisma.question.findMany();
    responseHandler(res, true, "Successful", { roles: questions });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const createQuestion: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.question.create({
      data: {
        content: req.body.content,
        time: req.body.time,
        difficulty: req.body.difficulty,
        type: req.body.type,
        Answer: {
          create: req.body.map((a: Answer) => ({
            content: a.content,
            correct: a.correct,
          })),
        },
      },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updateQuestion: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const question = await prisma.question.findFirst({
      where: {
        id: req.body.question_id,
      },
    });
    if (!question) return responseHandler(res, false, "question not found");

    await prisma.answer.deleteMany({
      where: { questionId: question.id },
    });

    await prisma.question.update({
      data: {
        content: req.body.content,
        time: req.body.time,
        difficulty: req.body.difficulty,
        type: req.body.type,
        Answer: {
          create: req.body.map((a: Answer) => ({
            content: a.content,
            correct: a.correct,
          })),
        },
      },
      where: { id: question.id },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const deleteQuestion: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const question = await prisma.question.findFirst({
      where: {
        id: req.body.question_id,
      },
    });
    if (!question) return responseHandler(res, false, "question not found");

    await prisma.answer.deleteMany({
      where: { questionId: question.id },
    });
    await prisma.question.delete({ where: { id: question.id } });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

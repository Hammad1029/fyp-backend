import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Answer } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

export const getQuestions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const questions = await prisma.question.findMany({
      include: { Answer: true, GameQuestion: true },
    });
    responseHandler(res, true, "Successful", questions);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

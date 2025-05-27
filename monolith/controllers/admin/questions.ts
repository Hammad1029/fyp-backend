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

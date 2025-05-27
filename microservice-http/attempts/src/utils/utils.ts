import { PrismaClient } from "@prisma/client";
import { Response } from "express";

export const prisma = new PrismaClient();

export const responseHandler = (
  res: Response,
  status: boolean,
  message: string,
  data?: Record<string, any>,
  error?: unknown
) => {
  if (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  } else {
    res.status(200).json({ status, message, data });
  }
};

export const calculateStats = async (
  playerId: number,
  excludeAttempt?: number
): Promise<Record<string, number>> => {
  const result = await prisma.attemptDetails.aggregate({
    where: {
      attempt: { playerId },
      attemptId: { not: excludeAttempt || 0 },
    },
    _sum: {
      easyTotal: true,
      easyCorrect: true,
      midTotal: true,
      midCorrect: true,
      mediumTotal: true,
      mediumCorrect: true,
      hardTotal: true,
      hardCorrect: true,
      advancedTotal: true,
      advancedCorrect: true,
      exceptionalTotal: true,
      exceptionalCorrect: true,
      textualTotal: true,
      textualCorrect: true,
      imageTotal: true,
      imageCorrect: true,
      auditoryTotal: true,
      auditoryCorrect: true,
    },
    _count: {
      _all: true,
    },
  });

  const pct = (correct: number | null, total: number | null) =>
    (total || 0) > 0 ? (correct || 0) / (total || 0) : 0.5;

  return {
    easy: pct(result._sum.easyCorrect, result._sum.easyTotal),
    mid: pct(result._sum.midCorrect, result._sum.midTotal),
    medium: pct(result._sum.mediumCorrect, result._sum.mediumTotal),
    hard: pct(result._sum.hardCorrect, result._sum.hardTotal),
    advanced: pct(result._sum.advancedCorrect, result._sum.advancedTotal),
    exceptional: pct(result._sum.exceptionalCorrect, result._sum.exceptionalTotal),
    textual: pct(result._sum.textualCorrect, result._sum.textualTotal),
    image: pct(result._sum.imageCorrect, result._sum.imageTotal),
    auditory: pct(result._sum.auditoryCorrect, result._sum.auditoryTotal),
    count: result._count._all,
  };
};

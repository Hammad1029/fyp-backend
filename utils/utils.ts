import prisma from "@/utils/prisma";
import { Player, Prisma } from "@prisma/client";
import { Response } from "express";

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

export const createRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const calculateStats = async (
  playerId: number,
  excludeAttempt?: number
): Promise<Record<string, number>> => {
  const sums = await prisma.attemptDetails.aggregate({
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
  });

  const pct = (correct: number | null, total: number | null) =>
    (total || 0) > 0 ? (correct || 0) / (total || 0) : 50;

  return {
    easy: pct(sums._sum.easyCorrect, sums._sum.easyTotal),
    mid: pct(sums._sum.midCorrect, sums._sum.midTotal),
    medium: pct(sums._sum.mediumCorrect, sums._sum.mediumTotal),
    hard: pct(sums._sum.hardCorrect, sums._sum.hardTotal),
    advanced: pct(sums._sum.advancedCorrect, sums._sum.advancedTotal),
    exceptional: pct(sums._sum.exceptionalCorrect, sums._sum.exceptionalTotal),
    textual: pct(sums._sum.textualCorrect, sums._sum.textualTotal),
    image: pct(sums._sum.imageCorrect, sums._sum.imageTotal),
    auditory: pct(sums._sum.auditoryCorrect, sums._sum.auditoryTotal),
  };
};

type PlayerWithIncludes = Prisma.PlayerGetPayload<{
  include: {
    Attempt: { include: { AttemptDetails: true; game: true } };
    PlayerInstitution: { include: { institution: true } };
  };
}>;

export const getPlayerData = async (
  id?: number
): Promise<PlayerWithIncludes | null> => {
  try {
    if (!id) return null;
    const player = await prisma.player.findFirst({
      where: {
        id,
      },
      include: {
        Attempt: { include: { AttemptDetails: true, game: true } },
        PlayerInstitution: { include: { institution: true } },
      },
    });
    if (!player) return null;
    return player;
  } catch (e) {
    console.error(e);
    return null;
  }
};

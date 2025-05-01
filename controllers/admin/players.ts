import prisma from "@/utils/prisma";
import { calculateStats, responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getPlayers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const players = await prisma.player.findMany({
      include: { Attempt: true },
    });
    responseHandler(res, true, "Successful", players);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getPlayerDetails: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const player = await prisma.player.findUnique({
      include: {
        Attempt: { include: { AttemptDetails: true, game: true } },
        PlayerInstitution: { include: { institution: true } },
      },
      where: { id: req.body.playerId },
    });
    if (!player) return responseHandler(res, false, "Player not found");
    const stats = await calculateStats(player.id);
    responseHandler(res, true, "Successful", { player, stats });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

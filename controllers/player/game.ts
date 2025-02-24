import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany();
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const startGame: RequestHandler = async (req: Request, res: Response) => {
  try {
    const attmpt = await prisma.attempt.;
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany();
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany();
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getGames: RequestHandler = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany();
    responseHandler(res, true, "Successful", { games });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

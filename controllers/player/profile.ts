import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import { Request, RequestHandler, Response } from "express";

export const getProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await prisma.player.findFirst({
      where: {
        id: req.user?.data?.id,
      },
    });
    if (!user) return responseHandler(res, false, "user not found");

    responseHandler(res, true, "Successful", { user });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const updateProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await prisma.player.findFirst({
      where: {
        id: req.user?.data?.id,
      },
    });
    if (!user) return responseHandler(res, false, "user not found");

    await prisma.player.update({
      data: {
        displayName: req.body.displayName,
        profilePhoto: req.body.profilePhoto,
        PlayerInstitution: {
          create: req.body.institutions.map((i: number) => ({
            institutionId: i,
          })),
        },
      },
      where: { id: user.id },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};
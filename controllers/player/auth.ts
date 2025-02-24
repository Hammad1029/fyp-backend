import * as constants from "@/utils/constants";
import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import bcrypt from "bcrypt";
import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const signUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await prisma.player.findFirst({
      where: { email: req.body.email },
    });
    if (user) return responseHandler(res, false, "player already exists");

    const password = await bcrypt.hash(
      req.body.password,
      constants.bcryptRounds
    );

    await prisma.player.create({
      data: {
        email: req.body.email,
        displayName: req.body.displayName,
        profilePhoto: req.body.profilePhoto,
        PlayerInstitution: {
          create: req.body.institutions.map((i: number) => ({
            institutionId: i,
          })),
        },
        password,
        token: "",
      },
    });

    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const signIn: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await prisma.player.findFirst({
      where: { email: req.body.email },
    });
    if (!user) return responseHandler(res, false, "player not found");

    const authenticated = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!authenticated) return responseHandler(res, false, "invalid password");

    const token = jwt.sign({ email: user.email }, constants.env.jwtSecret, {
      subject: String(user.id),
    });

    await prisma.player.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
    });

    responseHandler(res, true, "Successful", { token });
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const signOut: RequestHandler = async (req: Request, res: Response) => {
  try {
    await prisma.player.update({
      where: {
        id: req.user?.data?.id,
      },
      data: {
        token: "",
      },
    });

    let err = null;
    req.logout((e) => (err = e));

    if (err) throw err;
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

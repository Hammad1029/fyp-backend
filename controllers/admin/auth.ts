import * as constants from "@/utils/constants";
import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
import bcrypt from "bcrypt";
import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const signIn: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await prisma.admins.findFirst({
      where: { email: req.body.email },
    });
    if (!user) return responseHandler(res, false, "user not found");

    const authenticated = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!authenticated) return responseHandler(res, false, "invalid password");

    const token = jwt.sign({ email: user.email }, constants.env.jwtSecret, {
      subject: String(user.id),
    });

    await prisma.admins.update({
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
    await prisma.admins.update({
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

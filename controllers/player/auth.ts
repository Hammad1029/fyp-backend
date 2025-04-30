import * as constants from "@/utils/constants";
import sendEmail from "@/utils/email";
import prisma from "@/utils/prisma";
import { createRandomString, responseHandler } from "@/utils/utils";
import bcrypt from "bcryptjs";
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

    const mindtrackInstitution = await prisma.institution.findFirst({
      where: {
        type: { type: "Mindtrack" },
      },
    });
    if (!mindtrackInstitution)
      return responseHandler(res, false, "mindtrack institution not found");

    await prisma.player.create({
      data: {
        email: req.body.email,
        displayName: req.body.displayName,
        profilePhoto: req.body.profilePhoto,
        education: req.body.education,
        PlayerInstitution: {
          create: [
            ...req.body.institutions.map((i: number) => ({
              institutionId: i,
            })),
            mindtrackInstitution.id,
          ],
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

export const forgetPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await prisma.player.findFirst({
      where: { email: req.body.email },
    });
    if (!user) responseHandler(res, false, "user not found");
    else {
      const newPassword = createRandomString(8);
      const hashed = await bcrypt.hash(newPassword, constants.bcryptRounds);

      await prisma.player.update({
        data: { password: hashed },
        where: { id: user.id },
      });

      const emailError = await sendEmail({
        to: [user.email],
        subject: `Reset Password for ${user.email}`,
        body: `<ul style="line-height: 1.6;">
                <li><strong>Name:</strong> ${user.displayName}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>New Password:</strong> ${newPassword}</li>
              </ul>`,
      });
      if (emailError) throw new Error(emailError);
    }
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

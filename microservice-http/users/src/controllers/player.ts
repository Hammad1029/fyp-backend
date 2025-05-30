import insitutionService from "@/services/institution";
import * as constants from "@/utils/constants";
import sendEmail from "@/utils/email";
import { createRandomString, prisma, responseHandler } from "@/utils/utils";
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

    const mindtrackInstitution = await insitutionService.getInstitutionByType(
      "Mindtrack"
    );
    if (!mindtrackInstitution)
      return responseHandler(res, false, "mindtrack institution not found");

    const otherInstitutions = await insitutionService.getInstitutionsByIDs(
      req.body.institutions
    );
    if (!otherInstitutions || !Array.isArray(otherInstitutions))
      throw new Error("could not get institutions");
    else if (otherInstitutions.length < req.body.institutions.length)
      return responseHandler(res, false, "missing institutions");

    const player = await prisma.player.create({
      data: {
        email: req.body.email,
        displayName: req.body.displayName,
        profilePhoto: req.body.profilePhoto,
        education: req.body.education,
        password,
        token: "",
      },
    });
    const addInstitutions = await insitutionService.updatePlayerInstitutions(
      player.id,
      req.body.institutions
    );
    if (!addInstitutions) {
      await prisma.player.delete({ where: { id: player.id } });
      return responseHandler(
        res,
        false,
        "could not add institutions, sign up again"
      );
    }

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

    const playerInstitutions = await insitutionService.getPlayerInstitutions(
      user.id
    );
    if (!playerInstitutions)
      return responseHandler(res, false, "could not get player institutions");

    const token = jwt.sign(
      {
        email: user.email,
        displayName: user.displayName,
        institutionIds: playerInstitutions.map((p: any) => p.id),
        education: user.education,
      },
      constants.env.jwtSecret,
      {
        subject: String(user.id),
      }
    );

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
        id: res.locals.user.id,
      },
      data: {
        token: "",
      },
    });

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

import { Request, RequestHandler, Response, NextFunction } from "express";
import { responseHandler } from "@/utils/utils";
import jwt from "jsonwebtoken";
import * as constants from "@/utils/constants";

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;
    if (!token) return responseHandler(res, false, "token not found");
    try {
      res.locals.user = jwt.verify(token, constants.env.jwtSecret);
      next();
    } catch (e) {
      console.log(e);
      return responseHandler(res, false, "invalid token");
    }
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const authorize =
  (perm: string): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = res.locals.user.permissions;
      if (Array.isArray(permissions) && permissions.includes(perm)) next();
      else return responseHandler(res, false, `permission ${perm} required`);
    } catch (e) {
      responseHandler(res, false, "", undefined, e);
    }
  };

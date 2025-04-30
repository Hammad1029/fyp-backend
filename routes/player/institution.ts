import * as controllers from "@/controllers/player/institution";
import * as constants from "@/utils/constants";
import { Router } from "express";
import passport from "passport";

const institutionRouter = Router();

institutionRouter.get(
  "/",
  passport.authenticate(constants.passport.player),
  controllers.getInstitution
);

export default institutionRouter;

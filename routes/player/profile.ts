import * as controllers from "@/controllers/player/profile";
import * as constants from "@/utils/constants";
import { Router } from "express";
import passport from "passport";

const profileRouter = Router();

profileRouter.get(
  "/",
  passport.authenticate(constants.passport.player),
  controllers.getProfile
);
profileRouter.post(
  "/",
  passport.authenticate(constants.passport.player),
  controllers.updateProfile
);

export default profileRouter;

import * as controllers from "@/controllers/player/auth";
import * as constants from "@/utils/constants";
import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.post("/sign-up", controllers.signUp);
authRouter.post("/sign-in", controllers.signIn);
authRouter.get(
  "/sign-out",
  passport.authenticate(constants.passport.player),
  controllers.signOut
);
authRouter.post("/forgot-password", controllers.forgetPassword);

export default authRouter;

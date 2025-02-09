import * as controllers from "@/controllers/admin/auth";
import * as constants from "@/utils/constants";
import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.post("/sign-in", controllers.signIn);
authRouter.get(
  "/sign-out",
  passport.authenticate(constants.passport.admin),
  controllers.signOut
);

export default authRouter;

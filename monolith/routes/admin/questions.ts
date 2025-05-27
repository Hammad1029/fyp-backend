import * as controllers from "@/controllers/admin/questions";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants";

const questionRouter = Router();

questionRouter.get(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.getQuestions
);

export default questionRouter;

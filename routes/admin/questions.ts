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

questionRouter.put(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.updateQuestion
);

questionRouter.post(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.createQuestion
);

questionRouter.delete(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.deleteQuestion
);

export default questionRouter;

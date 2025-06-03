import * as controllers from "@/controllers/player/stats";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants";

const statsRouter: Router = Router();

statsRouter.get(
  "/getOverviewStats",
  passport.authenticate(constants.passport.player),
  controllers.getOverviewStats
);

statsRouter.get(
  "/getSkillLevels",
  passport.authenticate(constants.passport.player),
  controllers.getSkillLevels
);

statsRouter.get(
  "/getCategoryPerformance",
  passport.authenticate(constants.passport.player),
  controllers.getCategoryPerformance
);

statsRouter.get(
  "/getProgressionStats",
  passport.authenticate(constants.passport.player),
  controllers.getProgressionStats
);

statsRouter.get(
  "/getRecentActivity",
  passport.authenticate(constants.passport.player),
  controllers.getRecentActivity
);

export default statsRouter;

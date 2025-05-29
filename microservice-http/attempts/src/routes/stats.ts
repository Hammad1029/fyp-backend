import * as controllers from "@/controllers/stats";
import { Router } from "express";
import { authenticate, authorize } from "@/utils/middlewares";

const router: Router = Router();

router.get(
  "/getOverviewStats",
  authenticate,
  authorize("stats-view"),
  controllers.getOverviewStats
);

router.get(
  "/getSkillLevels",
  authenticate,
  authorize("stats-view"),
  controllers.getSkillLevels
);

router.get(
  "/getCategoryPerformance",
  authenticate,
  authorize("stats-view"),
  controllers.getCategoryPerformance
);

router.get(
  "/getProgressionStats",
  authenticate,
  authorize("stats-view"),
  controllers.getProgressionStats
);

router.get(
  "/getRecentActivity",
  authenticate,
  authorize("stats-view"),
  controllers.getRecentActivity
);

export default router;

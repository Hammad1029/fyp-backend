import * as controllers from "@/controllers/player/stats";
import { Router } from "express";

const statsRouter: Router = Router();

statsRouter.post("/getOverviewStats", controllers.getOverviewStats);

statsRouter.post("/getSkillLevels", controllers.getSkillLevels);

statsRouter.post("/getCategoryPerformance", controllers.getCategoryPerformance);

statsRouter.post("/getProgressionStats", controllers.getProgressionStats);

statsRouter.post("/getRecentActivity", controllers.getRecentActivity);

export default statsRouter;

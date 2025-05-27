import * as controllers from "@/controllers/internal";
import { Router } from "express";

const router: Router = Router();

router.post("/getByID", controllers.getInstitutionsByIDs);

router.post("/getByType", controllers.getInstitutionsByType);

router.post("/updatePlayerInstitutions", controllers.updatePlayerInstitutions);

router.post("/getPlayerInstitutions", controllers.getPlayerInstitutions)

export default router;

import * as controllers from "@/controllers/internal";
import { Router } from "express";

const router: Router = Router();

router.post("/deleteInstitutionAdmins", controllers.deleteInstitutionAdmins);

export default router;

import * as controllers from "@/controllers/internal";
import { Router } from "express";

const router = Router();

router.delete("/deleteInstitutionAdmins", controllers.deleteInstitutionAdmins);

export default router;

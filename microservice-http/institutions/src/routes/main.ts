import * as controllers from "@/controllers/main";
import { Router } from "express";
import { authenticate, authorize } from "@/utils/middlewares";

const router: Router = Router();

router.get(
  "/",
  authenticate,
  authorize("institutions-view"),
  controllers.getInstitutions
);

router.put(
  "/",
  authenticate,
  authorize("institutions-edit"),
  controllers.updateInstitution
);

router.post(
  "/",
  authenticate,
  authorize("institutions-add"),
  controllers.createInstitution
);

router.delete(
  "/",
  authenticate,
  authorize("institutions-delete"),
  controllers.deleteInstitution
);

router.get(
  "/types",
  authenticate,
  authorize("institutions-view"),
  controllers.getInstitutionTypes
);

export default router;

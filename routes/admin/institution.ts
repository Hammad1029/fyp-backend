import * as controllers from "@/controllers/admin/institution";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants";

const institutionRouter = Router();

institutionRouter.get(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.getInstitution
);

institutionRouter.put(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.updateInstitution
);

institutionRouter.post(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.createInstitution
);

institutionRouter.delete(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.deleteInstitution
);

export default institutionRouter;

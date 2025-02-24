import * as controllers from "@/controllers/admin/roles";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants"

const roleRouter = Router();

roleRouter.get(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.getRoles
);

roleRouter.put(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.updateRole
);

roleRouter.post(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.createRole
);

roleRouter.delete(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.deleteRole
);

export default roleRouter;

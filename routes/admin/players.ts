import * as controllers from "@/controllers/admin/players";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants";

const gameRouter = Router();

gameRouter.get(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.getPlayers
);

gameRouter.post(
  "/",
  passport.authenticate(constants.passport.admin),
  controllers.getPlayerDetails
);

export default gameRouter;

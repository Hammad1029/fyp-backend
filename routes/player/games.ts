import * as controllers from "@/controllers/player/game";
import * as constants from "@/utils/constants";
import { Router } from "express";
import passport from "passport";

const gameRouter = Router();

gameRouter.get(
  "/",
  passport.authenticate(constants.passport.player),
  controllers.getGames
);
gameRouter.post(
  "/start-game",
  passport.authenticate(constants.passport.player),
  controllers.startGame
);
gameRouter.post(
  "/next-question",
  passport.authenticate(constants.passport.player),
  controllers.nextQuestion
);

export default gameRouter;

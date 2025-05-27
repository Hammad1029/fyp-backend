import * as controllers from "@/controllers/admin";
import { authenticate, authorize } from "@/utils/middlewares";
import { Router } from "express";

const gameRouter = Router();

gameRouter.get("/", authenticate, authorize("game-view"), controllers.getGames);

gameRouter.put(
  "/",
  authenticate,
  authorize("game-edit"),
  controllers.updateGame
);

gameRouter.post(
  "/",
  authenticate,
  authorize("game-add"),
  controllers.createGame
);

gameRouter.delete(
  "/",
  authenticate,
  authorize("game-delete"),
  controllers.deleteGame
);

gameRouter.get(
  "/questions",
  authenticate,
  authorize("questions-view"),
  controllers.getQuestions
);

export default gameRouter;

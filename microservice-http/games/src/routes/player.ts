import * as controllers from "@/controllers/player";
import { Router } from "express";
import { authenticate } from "@/utils/middlewares";

const router = Router();

router.get(
  "/",
  authenticate,
  controllers.getGames
);

export default router;

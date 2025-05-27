import * as controllers from "@/controllers";
import { Router } from "express";
import { authenticate } from "./utils/middlewares";

const router = Router();

router.post("/start-attempt", authenticate, controllers.startAttempt);

router.post("/next-question", authenticate, controllers.nextQuestion);

export default router;

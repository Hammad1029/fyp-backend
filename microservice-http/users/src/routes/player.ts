import * as controllers from "@/controllers/player";
import { Router } from "express";
import { authenticate } from "@/utils/middlewares";

const router = Router();

router.post("/sign-up", controllers.signUp);

router.post("/sign-in", controllers.signIn);

router.get("/sign-out", authenticate, controllers.signOut);

router.post("/forgot-password", controllers.forgetPassword);

export default router;

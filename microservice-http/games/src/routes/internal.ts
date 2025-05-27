import * as controllers from "@/controllers/internal";
import { Router } from "express";

const internalRouter = Router();

internalRouter.post("/getGame", controllers.getGame);

internalRouter.post("/getQuestion", controllers.getQuestion);

export default internalRouter;

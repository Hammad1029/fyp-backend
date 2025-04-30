import { Router } from "express";
import authRouter from "./auth";
import institutionRouter from "./institution";
import profileRouter from "./profile";
import gameRouter from "./games";

const playerRouter = Router();

playerRouter.use("/auth", authRouter);
playerRouter.use("/institution", institutionRouter);
playerRouter.use("/profile", profileRouter);
playerRouter.use("/games", gameRouter);

export default playerRouter;

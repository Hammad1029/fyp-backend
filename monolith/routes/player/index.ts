import { Router } from "express";
import authRouter from "./auth";
import institutionRouter from "./institution";
import profileRouter from "./profile";
import gameRouter from "./games";
import statsRouter from "./stats";

const playerRouter = Router();

playerRouter.use("/auth", authRouter);
playerRouter.use("/institution", institutionRouter);
playerRouter.use("/profile", profileRouter);
playerRouter.use("/games", gameRouter);
playerRouter.use("/stats/", statsRouter);

export default playerRouter;

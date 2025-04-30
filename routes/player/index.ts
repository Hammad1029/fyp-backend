import { Router } from "express";
import authRouter from "./auth";
import institutionRouter from "./institution";

const playerRouter = Router();

playerRouter.use("/auth", authRouter);
playerRouter.use("/institution", institutionRouter);

export default playerRouter;

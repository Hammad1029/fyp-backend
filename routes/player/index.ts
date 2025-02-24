import { Router } from "express";
import authRouter from "./auth";

const playerRouter = Router();

playerRouter.use("/auth", authRouter);

export default playerRouter;

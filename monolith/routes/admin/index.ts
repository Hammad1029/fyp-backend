import { Router } from "express";
import authRouter from "./auth";
import gameRouter from "./game";
import institutionRouter from "./institution";
import playerRouter from "./players";
import questionRouter from "./questions";
import roleRouter from "./roles";
import userRouter from "./user";

const adminRouter = Router();

adminRouter.use("/auth/", authRouter);
adminRouter.use("/roles/", roleRouter);
adminRouter.use("/users/", userRouter);
adminRouter.use("/institutions/", institutionRouter);
adminRouter.use("/questions/", questionRouter);
adminRouter.use("/games/", gameRouter);
adminRouter.use("/players/", playerRouter);

export default adminRouter;

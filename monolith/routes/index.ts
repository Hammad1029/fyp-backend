import { Router } from "express";
import adminRouter from "./admin/index";
import playerRouter from "./player/index";
import statsRouter from "./stats";

const appRouter = Router();

appRouter.use("/admin", adminRouter);
appRouter.use("/player", playerRouter);
appRouter.use("/stats", statsRouter);

export default appRouter;

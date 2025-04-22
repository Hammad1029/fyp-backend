import { Router } from "express";
import adminRouter from "./admin/index";
import playerRouter from "./player/index";
const appRouter = Router();
appRouter.use("/admin", adminRouter);
appRouter.use("/player", playerRouter);
export default appRouter;
//# sourceMappingURL=index.js.map
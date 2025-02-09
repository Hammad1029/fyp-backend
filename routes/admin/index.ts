import { Router } from "express";
import authRouter from "./auth";

const adminRouter = Router();

adminRouter.use("/auth/", authRouter);
adminRouter.use("/roles/", authRouter);
adminRouter.use("/users/", authRouter);

export default adminRouter;

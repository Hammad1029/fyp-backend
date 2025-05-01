import * as controllers from "@/controllers/player/institution";
import { Router } from "express";

const institutionRouter = Router();

institutionRouter.get(
  "/",
  controllers.getInstitution
);

export default institutionRouter;

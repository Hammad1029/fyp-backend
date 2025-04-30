import * as controllers from "@/controllers/player/institution";
import * as constants from "@/utils/constants";
import { Router } from "express";
import passport from "passport";

const institutionRouter = Router();

institutionRouter.get(
  "/",
  controllers.getInstitution
);

export default institutionRouter;

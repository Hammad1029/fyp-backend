import * as controllers from "@/controllers/admin/game";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants";
const gameRouter = Router();
gameRouter.get("/", passport.authenticate(constants.passport.admin), controllers.getGames);
gameRouter.put("/", passport.authenticate(constants.passport.admin), controllers.updateGame);
gameRouter.post("/", passport.authenticate(constants.passport.admin), controllers.createGame);
gameRouter.delete("/", passport.authenticate(constants.passport.admin), controllers.deleteGame);
export default gameRouter;
//# sourceMappingURL=game.js.map
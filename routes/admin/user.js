import * as controllers from "@/controllers/admin/users";
import { Router } from "express";
import passport from "passport";
import * as constants from "@/utils/constants";
const userRouter = Router();
userRouter.get("/", passport.authenticate(constants.passport.admin), controllers.getUsers);
userRouter.put("/", passport.authenticate(constants.passport.admin), controllers.updateUser);
userRouter.post("/", passport.authenticate(constants.passport.admin), controllers.createUser);
userRouter.delete("/", passport.authenticate(constants.passport.admin), controllers.deleteUser);
export default userRouter;
//# sourceMappingURL=user.js.map
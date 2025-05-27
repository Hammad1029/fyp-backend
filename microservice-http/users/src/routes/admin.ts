import * as controllers from "@/controllers/admin";
import { Router } from "express";
import { authenticate, authorize } from "@/utils/middlewares";

const router: Router = Router();

router.post("/sign-in", controllers.signIn);

router.get("/sign-out", authenticate, controllers.signOut);

router.get(
  "/users",
  authenticate,
  authorize("user-view"),
  controllers.getUsers
);

router.put(
  "/users",
  authenticate,
  authorize("user-edit"),
  controllers.updateUser
);

router.post(
  "/users",
  authenticate,
  authorize("user-add"),
  controllers.createUser
);

router.delete(
  "/users",
  authenticate,
  authorize("user-delete"),
  controllers.deleteUser
);

router.get(
  "/roles",
  authenticate,
  authorize("role-view"),
  controllers.getRoles
);

router.put(
  "/roles",
  authenticate,
  authorize("role-edit"),
  controllers.updateRole
);

router.post(
  "/roles",
  authenticate,
  authorize("role-add"),
  controllers.createRole
);

router.delete(
  "/roles",
  authenticate,
  authorize("role-delete"),
  controllers.deleteRole
);

router.get(
  "/permissions",
  authenticate,
  authorize("role-view"),
  controllers.getPermissions
);

export default router;

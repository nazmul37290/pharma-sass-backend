import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { permissionRouter } from "../modules/permissions/permission.routes.js";
import { roleRouter } from "../modules/roles/role.routes.js";
import { userRouter } from "../modules/users/user.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/permissions", permissionRouter);

export { router as apiRouter };

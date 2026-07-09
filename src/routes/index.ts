import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";
import { userRouter } from "../modules/users/user.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/users", userRouter);

export { router as apiRouter };

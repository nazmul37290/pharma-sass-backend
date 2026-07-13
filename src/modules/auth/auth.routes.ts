import { Router } from "express";
import { validate } from "../../common/middleware/validate.js";
import { authenticate } from "../../common/middleware/auth.js";
import { authLimiter } from "../../common/middleware/rate-limit.js";
import * as authController from "./auth.controller.js";
import { loginSchema, tenantRegistrationSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, validate(tenantRegistrationSchema), authController.registerTenant);
authRouter.post("/login", authLimiter, validate(loginSchema), authController.login);
authRouter.get("/me", authenticate(), authController.me);

export { authRouter };

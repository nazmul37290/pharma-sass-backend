import { Router } from "express";
import { authenticate, authorizeSuperAdmin } from "../../common/middleware/auth.js";
import * as tenantController from "./tenant.controller.js";

const tenantRouter = Router();

tenantRouter.use(authenticate());
tenantRouter.get("/", authorizeSuperAdmin(), tenantController.listTenants);

export { tenantRouter };

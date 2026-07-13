import { Router } from "express";
import { authenticate, authorizePermission } from "../../common/middleware/auth.js";
import { validate } from "../../common/middleware/validate.js";
import * as permissionController from "./permission.controller.js";
import { createPermissionSchema } from "./permission.schema.js";

const permissionRouter = Router();

permissionRouter.use(authenticate());
permissionRouter.get("/", authorizePermission("manage_permissions"), permissionController.listPermissions);
permissionRouter.post("/", authorizePermission("manage_permissions"), validate(createPermissionSchema), permissionController.createPermission);

export { permissionRouter };

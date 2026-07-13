import { Router } from "express";
import { authenticate, authorizePermission } from "../../common/middleware/auth.js";
import { validate } from "../../common/middleware/validate.js";
import * as roleController from "./role.controller.js";
import { createRoleSchema, roleIdParamSchema } from "./role.schema.js";

const roleRouter = Router();

roleRouter.use(authenticate());
roleRouter.get("/", authorizePermission("manage_roles"), roleController.listRoles);
roleRouter.post("/", authorizePermission("manage_roles"), validate(createRoleSchema), roleController.createRole);
roleRouter.get("/:id", authorizePermission("manage_roles"), validate(roleIdParamSchema, "params"), roleController.getRole);
roleRouter.delete("/:id", authorizePermission("manage_roles"), validate(roleIdParamSchema, "params"), roleController.deleteRole);

export { roleRouter };

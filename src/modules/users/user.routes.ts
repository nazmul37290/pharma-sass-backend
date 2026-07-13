import { Router } from "express";
import { authenticate, authorizePermission } from "../../common/middleware/auth.js";
import { validate } from "../../common/middleware/validate.js";
import * as userController from "./user.controller.js";
import { createUserSchema, updateUserSchema, userIdParamSchema } from "./user.schema.js";

const userRouter = Router();

userRouter.use(authenticate());
userRouter.get("/", authorizePermission("manage_users"), userController.listUsers);
userRouter.post("/", authorizePermission("manage_users"), validate(createUserSchema), userController.createUser);
userRouter.get("/:id", authorizePermission("manage_users"), validate(userIdParamSchema, "params"), userController.getUser);
userRouter.put("/:id", authorizePermission("manage_users"), validate(userIdParamSchema, "params"), validate(updateUserSchema), userController.updateUser);
userRouter.delete("/:id", authorizePermission("manage_users"), validate(userIdParamSchema, "params"), userController.deleteUser);

export { userRouter };

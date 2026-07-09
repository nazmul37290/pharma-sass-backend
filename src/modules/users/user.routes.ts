import { Router } from "express";
import { validate } from "../../common/middleware/validate.js";
import * as userController from "./user.controller.js";
import { createUserSchema, userIdParamSchema } from "./user.schema.js";

const userRouter = Router();

userRouter.get("/", userController.listUsers);
userRouter.get("/:id", validate(userIdParamSchema, "params"), userController.getUser);
userRouter.post("/", validate(createUserSchema), userController.createUser);

export { userRouter };

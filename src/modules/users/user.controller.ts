import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error.js";
import { apiResponse } from "../../common/utils/api-response.js";
import * as userService from "./user.service.js";

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.createUser(req.user?.tenantId ?? "", req.body);
    apiResponse(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const user = await userService.getUserById(id, req.user?.tenantId ?? "");

    if (!user) {
      throw new AppError(404, "User not found");
    }

    apiResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.listUsers(req.user?.tenantId ?? "");
    apiResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const user = await userService.updateUser(id, req.user?.tenantId ?? "", req.body);
    apiResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await userService.deleteUser(id, req.user?.tenantId ?? "");
    apiResponse(res, 200, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
}

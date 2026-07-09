import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error.js";
import * as userService from "./user.service.js";

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const user = await userService.getUserById(id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.listUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

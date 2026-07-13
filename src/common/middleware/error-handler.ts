import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { apiError } from "../utils/api-response.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    apiError(res, err.statusCode, err.message);
    return;
  }

  if (err instanceof ZodError) {
    apiError(res, 400, "Validation failed", err.flatten().fieldErrors);
    return;
  }

  console.error(err);

  apiError(res, 500, "Internal server error");
}

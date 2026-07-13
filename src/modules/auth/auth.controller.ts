import type { NextFunction, Request, Response } from "express";
import { apiError, apiResponse } from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

export async function registerTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await authService.registerTenant(req.body);
        apiResponse(res, 201, "Tenant registered successfully", result);
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await authService.login(req.body);
        apiResponse(res, 200, "Login successful", result);
    } catch (error) {
        next(error);
    }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            apiError(res, 401, "Authentication required");
            return;
        }

        apiResponse(res, 200, "Authenticated user", req.user);
    } catch (error) {
        next(error);
    }
}

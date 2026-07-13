import type { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../common/utils/api-response.js";
import * as permissionService from "./permission.service.js";

export async function listPermissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const permissions = await permissionService.listPermissions();
        apiResponse(res, 200, "Permissions fetched successfully", permissions);
    } catch (error) {
        next(error);
    }
}

export async function createPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const permission = await permissionService.createPermission(req.body);
        apiResponse(res, 201, "Permission created successfully", permission);
    } catch (error) {
        next(error);
    }
}

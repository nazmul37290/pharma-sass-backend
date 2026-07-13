import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/errors/app-error.js";
import { apiResponse } from "../../common/utils/api-response.js";
import * as roleService from "./role.service.js";

export async function listRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const roles = await roleService.listRoles(req.user?.tenantId ?? "");
        apiResponse(res, 200, "Roles fetched successfully", roles);
    } catch (error) {
        next(error);
    }
}

export async function createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const role = await roleService.createRole(req.user?.tenantId ?? "", req.body);
        apiResponse(res, 201, "Role created successfully", role);
    } catch (error) {
        next(error);
    }
}

export async function getRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const roleId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const role = await roleService.getRole(roleId, req.user?.tenantId ?? "");

        if (!role) {
            throw new AppError(404, "Role not found");
        }

        apiResponse(res, 200, "Role fetched successfully", role);
    } catch (error) {
        next(error);
    }
}

export async function deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const roleId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = await roleService.deleteRole(roleId, req.user?.tenantId ?? "");
        apiResponse(res, 200, "Role deleted successfully", result);
    } catch (error) {
        next(error);
    }
}

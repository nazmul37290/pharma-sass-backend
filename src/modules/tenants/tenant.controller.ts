import type { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../common/utils/api-response.js";
import * as tenantService from "./tenant.service.js";

export async function listTenants(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tenants = await tenantService.listTenants();
        apiResponse(res, 200, "Tenants fetched successfully", tenants);
    } catch (error) {
        next(error);
    }
}

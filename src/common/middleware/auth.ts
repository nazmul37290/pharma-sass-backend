import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

export interface AuthUserPayload {
    sub: string;
    tenantId: string;
    roleId: string;
    roleName: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUserPayload;
        }
    }
}

export function authenticate(): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const header = req.headers.authorization;

            if (!header?.startsWith("Bearer ")) {
                throw new AppError(401, "Authentication token is required");
            }

            const token = header.split(" ")[1];
            const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;

            const user = await prisma.user.findUnique({
                where: { id: decoded.sub },
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: { permission: true },
                            },
                        },
                    },
                    tenant: true,
                },
            });

            if (!user || user.status !== "ACTIVE") {
                throw new AppError(401, "Invalid or inactive user account");
            }

            if (user.tenantId !== decoded.tenantId) {
                throw new AppError(401, "Tenant mismatch");
            }

            req.user = {
                sub: user.id,
                tenantId: user.tenantId,
                roleId: user.roleId,
                roleName: user.role.name,
                email: user.email,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}

export function authorizePermission(requiredPermission: string): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                next(new AppError(401, "Authentication required"));
                return;
            }

            const role = await prisma.role.findUnique({
                where: { id: req.user.roleId },
                include: {
                    permissions: {
                        include: { permission: true },
                    },
                },
            });


            const hasPermission = role?.permissions.some((entry) => entry.permission.action === requiredPermission);


            if (!hasPermission) {
                next(new AppError(403, "Insufficient permissions"));
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

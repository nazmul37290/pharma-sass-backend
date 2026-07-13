import type { Response } from "express";

export function apiResponse<T>(
    res: Response,
    statusCode = 200,
    message = "Success",
    data: T | null = null,
): Response {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export function apiError(
    res: Response,
    statusCode = 500,
    message = "Something went wrong",
    data: unknown = null,
): Response {
    return res.status(statusCode).json({
        success: false,
        message,
        data,
    });
}

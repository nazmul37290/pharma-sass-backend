declare module "jsonwebtoken" {
    export interface JwtPayload {
        [key: string]: unknown;
        sub?: string;
        tenantId?: string;
        roleId?: string;
        roleName?: string;
        email?: string;
    }

    export function sign(payload: string | object | Buffer, secret: string, options?: { expiresIn?: string | number }): string;
    export function verify(token: string, secret: string): JwtPayload;
}

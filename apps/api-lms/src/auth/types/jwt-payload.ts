import type { Role } from "@cerios/shared-types";

export interface JwtPayload {
    sub: string;
    username: string;
    roles: Role[];
}

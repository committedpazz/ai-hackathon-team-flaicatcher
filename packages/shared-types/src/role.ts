// Modeled as a const object + derived union (not a TS `enum`) so it structurally
// matches the string union type Prisma generates for its own `Role` enum,
// avoiding nominal-type mismatches between the API (Prisma) and shared DTOs.
export const Role = {
    ADMIN: "ADMIN",
    TRAINER: "TRAINER",
    LEARNER: "LEARNER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

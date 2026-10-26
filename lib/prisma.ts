import { PrismaClient } from "@prisma/client";

// Giữ một instance duy nhất khi dev (HMR tạo lại module liên tục → tránh cạn connection).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Global type augmentation for Prisma client singleton (prevents multiple instances in dev)
declare global {
  var prisma: import("@prisma/client").PrismaClient | undefined;
}

export {};
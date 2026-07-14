// Global type augmentation for Prisma client singleton (prevents multiple instances in dev)
declare global {
  // eslint-disable-next-line no-var
  var prisma: import("@prisma/client").PrismaClient | undefined;
}
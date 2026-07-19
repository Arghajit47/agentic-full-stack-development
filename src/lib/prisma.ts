import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import fs from "fs";

const databaseUrl = process.env.DATABASE_URL;
const prismaOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
};

if (databaseUrl && databaseUrl.startsWith("file:") && (process.env.NODE_ENV === "production" || process.env.NETLIFY)) {
  const relativePath = databaseUrl.replace("file:", "");
  const originalPath = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(process.cwd(), relativePath);

  const tempDbPath = "/tmp/dev.db";
  try {
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, tempDbPath);
      prismaOptions.datasources = {
        db: {
          url: `file:${tempDbPath}`,
        },
      };
      console.log(`Successfully copied SQLite DB from ${originalPath} to ${tempDbPath}`);
    } else {
      console.warn(`Original SQLite DB file not found at ${originalPath}`);
    }
  } catch (error) {
    console.error("Failed to copy SQLite database to /tmp:", error);
  }
}

const prisma =
  global.prisma ??
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
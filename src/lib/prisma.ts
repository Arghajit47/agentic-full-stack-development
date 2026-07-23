import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import fs from "fs";

const databaseUrl = process.env.DATABASE_URL;
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const prismaOptions: Prisma.PrismaClientOptions = {
  log: isDev ? ["query", "error", "warn"] : ["error"],
};

// Serverless runtimes (Netlify Functions, AWS Lambda, Vercel) mount the package directory read-only.
// Copy the bundled SQLite file to /tmp so Prisma can read AND write. Always do this outside dev/test
// for file-based databases so mutation endpoints don't fail with EROFS.
const serverlessDbUrl =
  databaseUrl?.startsWith("file:") && !isDev && !isTest
    ? databaseUrl
    : null;

if (serverlessDbUrl) {
  const relativePath = serverlessDbUrl.replace("file:", "");
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

if (!isDev) global.prisma = prisma;

export default prisma;
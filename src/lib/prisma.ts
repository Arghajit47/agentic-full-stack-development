import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import fs from "fs";

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const prismaOptions: Prisma.PrismaClientOptions = {
  log: isDev ? ["query", "error", "warn"] : ["error"],
};

// Serverless runtimes (Netlify Functions, AWS Lambda, Vercel) mount the package directory read-only.
// Copy the bundled SQLite file to /tmp so Prisma can read AND write.
const needsServerlessCopy =
  !isDev && !isTest && databaseUrl.startsWith("file:");

function findBundledDb(relativePath: string): string | null {
  const candidates = [
    path.isAbsolute(relativePath) ? relativePath : path.resolve(process.cwd(), relativePath),
    path.resolve(process.cwd(), relativePath),
    path.resolve("/var/task", relativePath),
    path.resolve("/var/task", "prisma/dev.db"),
    path.resolve("/tmp", "prisma/dev.db"),
    // When bundled by Next.js, __dirname is inside .next/server/chunks.
    path.resolve(__dirname, "../../..", "prisma/dev.db"),
    path.resolve(__dirname, "../../../../prisma/dev.db"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  console.warn("Bundled SQLite DB not found in any candidate path:", candidates);
  return null;
}

if (needsServerlessCopy) {
  const relativePath = databaseUrl.replace("file:", "");
  const originalPath = findBundledDb(relativePath);

  const tempDbPath = "/tmp/dev.db";
  try {
    if (originalPath) {
      fs.copyFileSync(originalPath, tempDbPath);
      fs.chmodSync(tempDbPath, 0o644);
      prismaOptions.datasources = {
        db: {
          url: `file:${tempDbPath}`,
        },
      };
      console.log(`Successfully copied SQLite DB from ${originalPath} to ${tempDbPath}`);
    } else {
      console.warn(`Original SQLite DB file not found for ${relativePath}`);
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

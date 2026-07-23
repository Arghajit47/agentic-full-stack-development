import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const relativePath = databaseUrl.replace("file:", "");
  const candidates = [
    path.isAbsolute(relativePath) ? relativePath : path.resolve(process.cwd(), relativePath),
    path.resolve(process.cwd(), relativePath),
    path.resolve("/var/task", relativePath),
    path.resolve("/var/task", "prisma/dev.db"),
    path.resolve("/tmp", "prisma/dev.db"),
    path.resolve(__dirname, "../../..", "prisma/dev.db"),
    path.resolve(__dirname, "../../../../prisma/dev.db"),
  ];
  const checked = candidates.map((p) => ({ path: p, exists: fs.existsSync(p) }));
  return NextResponse.json({
    cwd: process.cwd(),
    __dirname,
    databaseUrl,
    nodeEnv: process.env.NODE_ENV,
    checked,
  });
}

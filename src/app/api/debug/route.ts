import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const relativePath = databaseUrl.replace("file:", "");
  const cwd = process.cwd();
  const candidates = [
    path.isAbsolute(relativePath) ? relativePath : path.resolve(cwd, relativePath),
    path.resolve("/var/task", relativePath),
    path.resolve("/var/task", "prisma/dev.db"),
    path.resolve("/opt/nodejs", "prisma/dev.db"),
  ];
  return NextResponse.json({
    cwd,
    databaseUrl,
    NODE_ENV: process.env.NODE_ENV,
    checked: candidates.map((p) => ({ path: p, exists: fs.existsSync(p) })),
    tmp: fs.existsSync("/tmp") ? fs.readdirSync("/tmp").slice(0, 10) : "no /tmp",
  });
}

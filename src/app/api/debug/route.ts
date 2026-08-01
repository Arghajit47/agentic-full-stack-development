import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const relativePath = databaseUrl.replace("file:", "");
  const candidates = [
    path.isAbsolute(relativePath) ? relativePath : path.resolve(process.cwd(), relativePath),
    path.resolve("/var/task", relativePath),
    path.resolve("/var/task", "prisma/dev.db"),
    path.resolve(__dirname, "../../..", "prisma/dev.db"),
    path.resolve(__dirname, "../../../../prisma/dev.db"),
    path.resolve(__dirname, "../../../../../prisma/dev.db"),
  ];
  return NextResponse.json({
    cwd: process.cwd(),
    __dirname,
    databaseUrl,
    NODE_ENV: process.env.NODE_ENV,
    checked: candidates.map((p) => ({ path: p, exists: fs.existsSync(p) })),
    tmp: fs.existsSync("/tmp") ? fs.readdirSync("/tmp") : "no /tmp",
  });
}

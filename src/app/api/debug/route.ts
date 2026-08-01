import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

function findFiles(dir: string, pattern: string, depth = 0): string[] {
  if (depth > 2 || !fs.existsSync(dir)) return [];
  try {
    return fs.readdirSync(dir).flatMap((f) => {
      const full = path.join(dir, f);
      if (f === pattern) return [full];
      if (depth < 2) {
        try {
          if (fs.statSync(full).isDirectory()) return findFiles(full, pattern, depth + 1);
        } catch { return []; }
      }
      return [];
    });
  } catch { return []; }
}

export async function GET() {
  const cwd = process.cwd();
  return NextResponse.json({
    cwd,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    varTaskContents: fs.existsSync("/var/task") ? fs.readdirSync("/var/task").slice(0, 20) : "no /var/task",
    devDbLocations: findFiles("/var/task", "dev.db"),
    tmp: fs.existsSync("/tmp") ? fs.readdirSync("/tmp").slice(0, 10) : "no /tmp",
  });
}

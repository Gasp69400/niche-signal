import { execSync, spawn } from "node:child_process";
import { rmSync } from "node:fs";

const PORT = 3002;

try {
  const pids = execSync(`lsof -ti :${PORT}`, { encoding: "utf8" }).trim();
  if (pids) {
    execSync(`kill -9 ${pids.split("\n").join(" ")}`);
  }
} catch {
  // Port libre
}

rmSync(".next", { recursive: true, force: true });

const child = spawn("npx", ["next", "dev", "-p", String(PORT)], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));

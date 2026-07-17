const { execSync } = require("node:child_process");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

module.exports = function globalSetup() {
  execSync("npm run seed", { cwd: repoRoot, stdio: "inherit" });
};

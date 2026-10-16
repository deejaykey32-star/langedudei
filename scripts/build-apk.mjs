// Buduje podpisany APK (gradlew assembleRelease) i kopiuje go do public/download.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const win = process.platform === "win32";
const r = spawnSync(win ? "gradlew.bat" : "./gradlew", ["assembleRelease"], { cwd: path.join(root, "android"), stdio: "inherit", shell: win });
if (r.status !== 0) process.exit(r.status || 1);
await import("./copy-apk.mjs");

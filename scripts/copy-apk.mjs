// Kopiuje zbudowany, podpisany APK do public/download, skąd można go pobrać z aplikacji (przycisk i kod QR).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "android", "app", "build", "outputs", "apk", "release", "app-release.apk");
const dir = path.join(root, "public", "download");
await fs.mkdir(dir, { recursive: true });
await fs.copyFile(src, path.join(dir, "LangEduDei.apk"));
const { size } = await fs.stat(src);
console.log(`✔ public/download/LangEduDei.apk (${(size / 1048576).toFixed(1)} MB)`);

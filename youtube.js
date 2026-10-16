// Serwerowa wersja obsługi YouTube: rdzeń z public/js/shared/ytCore.js + fetch Node i pamięć na dysku.
import fs from "node:fs/promises";
import path from "node:path";
import { createYouTube } from "./public/js/shared/ytCore.js";

let cacheDir = null;
export function initYtCache(dir) {
  cacheDir = dir;
  return fs.mkdir(dir, { recursive: true });
}

const http = {
  async request({ method, url, body }) {
    const r = await fetch(url, body ? { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { method });
    return { status: r.status, text: await r.text() };
  },
};

// Pamięć: transkrypcje jako osobne pliki, macierz filmów w slots.json.
const fileFor = (key) => (key === "slots" ? "slots.json" : `${key.replace(/^tr:/, "")}.json`);
const store = {
  async get(key) {
    if (!cacheDir) return null;
    try {
      return JSON.parse(await fs.readFile(path.join(cacheDir, fileFor(key)), "utf8"));
    } catch {
      return null;
    }
  },
  async set(key, value) {
    if (cacheDir) await fs.writeFile(path.join(cacheDir, fileFor(key)), JSON.stringify(value)).catch(() => {});
  },
};

const yt = createYouTube({ http, store });
export const { getTranscript, getVideoSlot, slotStats } = yt;

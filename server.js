// Serwer aplikacji: serwuje frontend i przekazuje rozmowy do darmowego lektora AI Kuraka w chmurze.
import "dotenv/config";
import express from "express";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import QRCode from "qrcode";
import { fileURLToPath } from "node:url";
import { VOICES, synthesize, initCache } from "./tts.js";
import { getTranscript, initYtCache, getVideoSlot, slotStats } from "./youtube.js";
import { askKurak, KURAK_URL } from "./public/js/shared/cloud.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  express.static(path.join(here, "public"), {
    setHeaders: (res, file) => {
      if (file.endsWith(".apk")) {
        res.setHeader("Content-Type", "application/vnd.android.package-archive");
        res.setHeader("Content-Disposition", 'attachment; filename="LangEduDei.apk"');
      }
    },
  }),
);

// Lektor AI Kurak działa za darmo w chmurze (Cloudflare Workers AI) – serwer tylko przekazuje zapytania.
const post = async (url, headers, body) => {
  const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  return { status: r.status, text: await r.text() };
};

// --- Lektor neuronowy: angielskie głosy dla tekstu EN, polskie tylko dla tłumaczeń ---
initCache(path.join(here, ".tts-cache")).catch(() => {});

app.get("/api/tts/voices", (_req, res) => res.json(VOICES));

app.get("/api/tts", async (req, res) => {
  const text = String(req.query.text || "").trim().slice(0, 2000);
  if (!text) return res.status(400).json({ error: "Brak tekstu" });
  const lang = String(req.query.lang || "en-US");
  try {
    const audio = await synthesize({ text, voice: String(req.query.voice || ""), lang, rate: req.query.rate });
    res.set({ "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000, immutable" });
    res.send(audio);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(502).json({ error: "Lektor neuronowy jest chwilowo niedostępny." });
  }
});

// --- Transkrypcje filmów YouTube (ćwiczenia z filmami) ---
initYtCache(path.join(here, ".yt-cache")).catch(() => {});

app.get("/api/youtube/transcript", async (req, res) => {
  try {
    res.json(await getTranscript(String(req.query.id || "")));
  } catch (err) {
    res.status(502).json({ error: err.message || "Nie udało się pobrać napisów filmu." });
  }
});

// Filmy do lekcji: (lekcja × temat) → 3 filmy, wyszukane i zweryfikowane na żądanie.
app.get("/api/videos/slot", async (req, res) => {
  const lesson = String(req.query.lesson || "");
  const topic = String(req.query.topic || "");
  const queries = [].concat(req.query.q || []).map((q) => String(q).slice(0, 140)).filter(Boolean).slice(0, 4);
  const exclude = [].concat(req.query.x || []).map(String).filter((x) => /^[\w-]{11}$/.test(x)).slice(0, 10);
  if (!/^[\w-]+:[\w-]+$/.test(lesson) || !/^[\w-]+$/.test(topic) || !queries.length) return res.status(400).json({ error: "Nieprawidłowe zapytanie" });
  try {
    res.json({ videos: await getVideoSlot(lesson, topic, queries, exclude) });
  } catch (err) {
    res.status(502).json({ error: err.message || "Nie udało się znaleźć filmów." });
  }
});

app.get("/api/videos/stats", async (_req, res) => res.json(await slotStats()));

// --- Pobieranie aplikacji na Androida (APK) ---
const APK_FILE = path.join(here, "public", "download", "LangEduDei.apk");
const rank = (ip) => (/^192\.168\./.test(ip) ? 0 : /^10\./.test(ip) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ? 2 : 3);
function lanUrls() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    // Najpierw adresy sieci domowej (Wi-Fi), potem pozostałe (np. VPN 100.x).
    .sort((a, b) => rank(a.address) - rank(b.address))
    .map((i) => `http://${i.address}:${PORT}/download/LangEduDei.apk`);
}

app.get("/api/download/info", async (_req, res) => {
  try {
    const st = await fs.stat(APK_FILE);
    res.json({ available: true, size: st.size, updated: st.mtime, path: "/download/LangEduDei.apk", lan: lanUrls() });
  } catch {
    res.json({ available: false, lan: lanUrls() });
  }
});

// Kod QR (SVG) – tylko dla adresów pobierania tej aplikacji w sieci lokalnej.
app.get("/api/download/qr", async (req, res) => {
  const url = String(req.query.u || "");
  if (!lanUrls().includes(url) && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/download\/LangEduDei\.apk$/.test(url)) return res.status(400).end();
  res.type("image/svg+xml").send(await QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#14161b", light: "#ffffff" } }));
});

app.get("/api/status", (_req, res) => {
  res.json({ ai: true, keyConfigured: true, model: "Workers AI (darmowy)", cloud: KURAK_URL });
});

for (const route of ["chat", "generate"]) {
  app.post(`/api/${route}`, async (req, res) => {
    try {
      res.json(await askKurak(post, `/${route}`, req.body || {}));
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });
}

app.listen(PORT, () => {
  console.log(`🐓 LangEduDei działa: http://localhost:${PORT}`);
  console.log(`Lektor AI Kurak (darmowy, w chmurze): ${KURAK_URL}`);
});

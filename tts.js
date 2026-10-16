// Lektor neuronowy (głosy Microsoft Edge „Read Aloud”) – osobne głosy angielskie i polskie.
// Nagrania są zapisywane w .tts-cache, żeby ten sam tekst nie był generowany ponownie.
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const VOICES = [
  { id: "en-US-AriaNeural", lang: "en-US", label: "🇺🇸 Aria (kobieta)" },
  { id: "en-US-GuyNeural", lang: "en-US", label: "🇺🇸 Guy (mężczyzna)" },
  { id: "en-US-JennyNeural", lang: "en-US", label: "🇺🇸 Jenny (kobieta)" },
  { id: "en-US-AndrewNeural", lang: "en-US", label: "🇺🇸 Andrew (mężczyzna)" },
  { id: "en-GB-SoniaNeural", lang: "en-GB", label: "🇬🇧 Sonia (kobieta)" },
  { id: "en-GB-RyanNeural", lang: "en-GB", label: "🇬🇧 Ryan (mężczyzna)" },
  { id: "en-AU-NatashaNeural", lang: "en-AU", label: "🇦🇺 Natasha (kobieta)" },
  { id: "en-AU-WilliamNeural", lang: "en-AU", label: "🇦🇺 William (mężczyzna)" },
  { id: "pl-PL-ZofiaNeural", lang: "pl-PL", label: "🇵🇱 Zofia (kobieta)" },
  { id: "pl-PL-MarekNeural", lang: "pl-PL", label: "🇵🇱 Marek (mężczyzna)" },
];

// Przewodnik to kogut Kurak – domyślnie męskie głosy.
const DEFAULT_FOR_LANG = { "en-US": "en-US-GuyNeural", "en-GB": "en-GB-RyanNeural", "en-AU": "en-AU-WilliamNeural", "pl-PL": "pl-PL-MarekNeural" };

export function resolveVoice(voice, lang) {
  if (VOICES.some((v) => v.id === voice)) return voice;
  return DEFAULT_FOR_LANG[lang] || DEFAULT_FOR_LANG["en-US"];
}

// Jedno połączenie na głos, zapytania w kolejce (usługa ogranicza liczbę nowych połączeń).
const clients = new Map(); // voice -> { tts, ready, queue }

function client(voice) {
  let c = clients.get(voice);
  if (!c) {
    const tts = new MsEdgeTTS();
    c = { tts, ready: tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3), queue: Promise.resolve() };
    clients.set(voice, c);
  }
  return c;
}

function dropClient(voice) {
  const c = clients.get(voice);
  if (c) {
    try {
      c.tts.close();
    } catch {
      /* już zamknięte */
    }
    clients.delete(voice);
  }
}

async function synthOnce(voice, text, rate) {
  const c = client(voice);
  const job = c.queue.then(async () => {
    await c.ready;
    const { audioStream } = c.tts.toStream(text, { rate });
    const chunks = [];
    for await (const chunk of audioStream) chunks.push(chunk);
    const buf = Buffer.concat(chunks);
    if (!buf.length) throw new Error("Pusta odpowiedź lektora");
    return buf;
  });
  c.queue = job.catch(() => {});
  return job;
}

let cacheDir = null;

export function initCache(dir) {
  cacheDir = dir;
  return fs.mkdir(dir, { recursive: true });
}

export async function synthesize({ text, voice, lang, rate }) {
  const v = resolveVoice(voice, lang);
  const r = Math.min(1.5, Math.max(0.5, Number(rate) || 1));
  const key = crypto.createHash("sha1").update(`${v}|${r}|${text}`).digest("hex");
  const file = cacheDir && path.join(cacheDir, `${key}.mp3`);
  if (file) {
    try {
      return await fs.readFile(file);
    } catch {
      /* brak w cache */
    }
  }
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const buf = await synthOnce(v, text, r);
      if (file) fs.writeFile(file, buf).catch(() => {});
      return buf;
    } catch (err) {
      lastErr = err;
      dropClient(v);
      await new Promise((res) => setTimeout(res, 1000 * (attempt * 2 + 1)));
    }
  }
  throw lastErr;
}

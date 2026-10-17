// Natywna warstwa aplikacji LangEduDei na Androida (Capacitor) – zastępuje serwer Node.
// Pakowana przez esbuild do js/native/bundle.js w katalogu mobile-www.
import { CapacitorHttp, registerPlugin } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { createYouTube } from "../public/js/shared/ytCore.js";
import { askKurak } from "../public/js/shared/cloud.js";

const KurakWidget = registerPlugin("KurakWidget");

export async function syncWidget(items) {
  try {
    await KurakWidget.syncDifficultItems({ items });
  } catch (e) {
    console.warn("syncWidget error:", e);
  }
}

export async function getWidgetLaunchItem() {
  try {
    const res = await KurakWidget.getLaunchItem();
    return res?.wordId || null;
  } catch {
    return null;
  }
}

export async function refreshWidget() {
  try {
    await KurakWidget.refreshWidget();
  } catch {}
}

// ---------- Lektor AI Kurak: darmowy model w chmurze (Cloudflare Workers AI), bez klucza w telefonie ----------
const post = async (url, headers, body) => {
  const r = await CapacitorHttp.request({ method: "POST", url, headers, data: body, responseType: "text", connectTimeout: 20000, readTimeout: 90000 });
  return { status: r.status, text: typeof r.data === "string" ? r.data : JSON.stringify(r.data) };
};

export async function status() {
  return { ai: true, keyConfigured: true, model: "Workers AI (darmowy)", native: true };
}

export const chat = (payload) => askKurak(post, "/chat", payload);
export const generate = (payload) => askKurak(post, "/generate", payload);

// ---------- YouTube przez natywny HTTP (bez ograniczeń CORS) ----------
const http = {
  async request({ method, url, body }) {
    const r = await CapacitorHttp.request({
      method,
      url,
      headers: body ? { "Content-Type": "application/json" } : {},
      data: body,
      responseType: "text",
    });
    const text = typeof r.data === "string" ? r.data : JSON.stringify(r.data);
    return { status: r.status, text };
  },
};

// Prosta baza klucz–wartość w IndexedDB (macierz filmów może mieć wiele megabajtów).
const DB = "led-native-cache";
function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("kv");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
const store = {
  async get(key) {
    const db = await idb();
    return new Promise((resolve) => {
      const r = db.transaction("kv").objectStore("kv").get(key);
      r.onsuccess = () => resolve(r.result ?? null);
      r.onerror = () => resolve(null);
    });
  },
  async set(key, value) {
    const db = await idb();
    return new Promise((resolve) => {
      const tx = db.transaction("kv", "readwrite");
      tx.objectStore("kv").put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  },
};

const yt = createYouTube({ http, store });
export const transcript = (id) => yt.getTranscript(id);
export const slot = (lessonId, topicId, queries) => yt.getVideoSlot(lessonId, topicId, queries);

// ---------- Natywny lektor (Android TTS) ----------
let voiceList = null;
export async function voices() {
  if (!voiceList) {
    try {
      voiceList = (await TextToSpeech.getSupportedVoices()).voices || [];
    } catch {
      voiceList = [];
    }
  }
  return voiceList;
}

// Wybiera głos tylko w danym języku – angielski tekst czyta zawsze angielski głos.
async function voiceIndex(lang, preferredUri) {
  const list = await voices();
  const prefix = lang.slice(0, 2).toLowerCase();
  const norm = (l) => (l || "").toLowerCase().replace("_", "-");
  if (preferredUri) {
    const i = list.findIndex((v) => v.voiceURI === preferredUri && norm(v.lang).startsWith(prefix));
    if (i >= 0) return i;
  }
  let i = list.findIndex((v) => norm(v.lang) === lang.toLowerCase());
  if (i < 0) i = list.findIndex((v) => norm(v.lang).startsWith(prefix));
  return i >= 0 ? i : undefined;
}

export async function speak(text, { lang = "en-US", rate = 1, voiceUri = "" } = {}) {
  const voice = await voiceIndex(lang, voiceUri);
  // Rate Androida: 1.0 = normalnie; nasza skala jest podobna (0.5–1.2).
  await TextToSpeech.speak({ text, lang, rate: Math.max(0.3, Math.min(1.5, rate)), pitch: lang.startsWith("en") ? 0.9 : 1, volume: 1, voice, category: "playback", queueStrategy: 0 });
}

export async function stopSpeaking() {
  try {
    await TextToSpeech.stop();
  } catch {
    /* nic nie mówi */
  }
}

export async function openTtsInstall() {
  try {
    await TextToSpeech.openInstall();
  } catch {
    /* brak instalatora */
  }
}

// ---------- Natywne rozpoznawanie mowy (Android SpeechRecognizer) ----------
export async function listen({ lang = "en-US", interim } = {}) {
  const { available } = await SpeechRecognition.available();
  if (!available) throw new Error("Rozpoznawanie mowy jest niedostępne na tym telefonie (zainstaluj aplikację Google).");
  const perm = await SpeechRecognition.requestPermissions();
  if (perm.speechRecognition !== "granted") throw new Error("Brak zgody na użycie mikrofonu.");
  let sub = null;
  if (interim) sub = await SpeechRecognition.addListener("partialResults", (d) => d.matches?.[0] && interim(d.matches[0]));
  try {
    const res = await SpeechRecognition.start({ language: lang, maxResults: 1, partialResults: false, popup: false });
    return (res?.matches?.[0] || "").trim();
  } finally {
    sub?.remove();
  }
}

export async function stopListening() {
  try {
    await SpeechRecognition.stop();
  } catch {
    /* nie słuchał */
  }
}

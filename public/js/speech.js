// Lektor: synteza mowy (TTS), rozpoznawanie mowy (STT) i nagrywanie głosu.
import { getState } from "./storage.js";
import { isNative, native } from "./backend.js";

let voices = [];

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  voices = speechSynthesis.getVoices();
}
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

const isPolish = (lang) => Boolean(lang && lang.toLowerCase().startsWith("pl"));

export function englishVoices() {
  return voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
}

// Głos przeglądarki WYŁĄCZNIE w danym języku – nigdy polski głos dla angielskiego tekstu.
function pickBrowserVoice(lang) {
  const { voiceURI } = getState().settings;
  const prefix = isPolish(lang) ? "pl" : "en";
  const pool = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
  if (!pool.length) return null;
  if (!isPolish(lang) && voiceURI) {
    const chosen = pool.find((v) => v.voiceURI === voiceURI);
    if (chosen) return chosen;
  }
  const exact = pool.filter((v) => v.lang.toLowerCase().replace("_", "-") === lang.toLowerCase());
  const list = exact.length ? exact : pool;
  const score = (v) => (/natural/i.test(v.name) ? 3 : 0) + (/online|google|neural/i.test(v.name) ? 2 : 0) + (v.localService ? 0 : 1);
  return [...list].sort((a, b) => score(b) - score(a))[0];
}

export function ttsAvailable() {
  return true;
}

// --- Lektor neuronowy z serwera (angielski lub polski) ---
let currentAudio = null;
let currentResolve = null;
let speakToken = 0;
const audioCache = new Map(); // klucz -> URL obiektu blob
let warnedNoVoice = false;

export function stopSpeaking() {
  speakToken++;
  if (isNative) native().then((m) => m.stopSpeaking()).catch(() => {});
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentResolve?.();
  currentResolve = null;
}

async function neuralUrl(text, lang, rate) {
  const st = getState().settings;
  const voice = isPolish(lang) ? st.neuralVoicePl : st.neuralVoice;
  const key = `${voice}|${lang}|${rate}|${text}`;
  if (audioCache.has(key)) return audioCache.get(key);
  const q = new URLSearchParams({ text, lang, rate: String(rate), voice: voice || "" });
  const res = await fetch(`/api/tts?${q}`);
  if (!res.ok) throw new Error("tts");
  const url = URL.createObjectURL(await res.blob());
  audioCache.set(key, url);
  return url;
}

function playUrl(url, token) {
  return new Promise((resolve) => {
    if (token !== speakToken) return resolve();
    const a = new Audio(url);
    currentAudio = a;
    currentResolve = resolve;
    a.onended = a.onerror = () => {
      if (currentAudio === a) currentAudio = null;
      resolve();
    };
    a.play().catch(() => resolve());
  });
}

function speakBrowser(text, lang, rate, onBoundary) {
  return new Promise((resolve) => {
    const voice = pickBrowserVoice(lang);
    if (!voice || !("speechSynthesis" in window)) {
      if (!warnedNoVoice) {
        warnedNoVoice = true;
        window.dispatchEvent(new CustomEvent("tts-missing", { detail: { lang } }));
      }
      return resolve();
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = rate;
    if (onBoundary) u.onboundary = onBoundary;
    currentResolve = resolve;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

// Odczytuje tekst. Domyślnie ANGIELSKI lektor (wybrany akcent). Polski tylko z lang: "pl-PL".
export async function speak(text, { rate, lang, onBoundary } = {}) {
  if (!text) return;
  stopSpeaking();
  const token = speakToken;
  const st = getState().settings;
  const language = lang || st.accent || "en-US";
  const r = rate ?? (isPolish(language) ? 1 : st.rate);
  // Android: natywny lektor (Google TTS) – osobny głos angielski i polski.
  if (isNative) {
    try {
      const m = await native();
      if (token !== speakToken) return;
      await new Promise((resolve) => {
        currentResolve = resolve;
        m.speak(text, { lang: language, rate: r, voiceUri: isPolish(language) ? st.nativeVoicePl : st.nativeVoice }).then(resolve, () => {
          if (!warnedNoVoice) {
            warnedNoVoice = true;
            window.dispatchEvent(new CustomEvent("tts-missing", { detail: { lang: language } }));
          }
          resolve();
        });
      });
    } catch {
      /* brak lektora */
    }
    return;
  }
  if (st.engine !== "browser") {
    try {
      const url = await neuralUrl(text, language, r);
      return await playUrl(url, token);
    } catch {
      /* serwer niedostępny – głos przeglądarki w tym samym języku */
    }
  }
  if (token !== speakToken) return;
  return speakBrowser(text, language, r, onBoundary);
}

export function speakPl(text, opts = {}) {
  return speak(text, { ...opts, lang: "pl-PL" });
}

export function sttAvailable() {
  return isNative || Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// Rozpoznaje jedną wypowiedź. lang: "en-US" lub "pl-PL" (pytania po polsku).
export function listen({ lang = "en-US", interim } = {}) {
  if (isNative) return native().then((m) => m.listen({ lang, interim }));
  return new Promise((resolve, reject) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return reject(new Error("Twoja przeglądarka nie obsługuje rozpoznawania mowy. Użyj Chrome lub Edge."));
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = Boolean(interim);
    rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      for (const r of e.results) text += r[0].transcript;
      if (interim) interim(text);
      if (e.results[e.results.length - 1].isFinal) finalText = text;
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech") resolve("");
      else reject(new Error(e.error === "not-allowed" ? "Brak dostępu do mikrofonu." : `Błąd rozpoznawania mowy: ${e.error}`));
    };
    rec.onend = () => resolve(finalText.trim());
    rec.start();
    listen.current = rec;
  });
}

export function stopListening() {
  if (isNative) native().then((m) => m.stopListening()).catch(() => {});
  listen.current?.stop();
}

// Nagrywanie głosu (MediaRecorder) – do porównywania nagrań.
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  rec.start();
  return {
    stop: () =>
      new Promise((resolve) => {
        rec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          resolve(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
        };
        rec.stop();
      }),
  };
}

// Porównanie wypowiedzi z wzorcem: wynik 0-100 i lista słów z oznaczeniem trafień.
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export function compareSpeech(target, said) {
  const t = norm(target);
  const s = norm(said);
  const pool = [...s];
  const words = t.map((w) => {
    const idx = pool.indexOf(w);
    if (idx >= 0) pool.splice(idx, 1);
    return { word: w, ok: idx >= 0 };
  });
  const score = t.length ? Math.round((words.filter((w) => w.ok).length / t.length) * 100) : 0;
  return { score, words };
}

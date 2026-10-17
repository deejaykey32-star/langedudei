// Postęp i ustawienia w localStorage (+ nagrania głosu w IndexedDB).
import { triggerWidgetSync } from "./widgetSync.js";

const KEY = "eu-trainer-v1";

const DEFAULTS = {
  startDate: null,
  weekOverride: null,
  settings: { engine: "neural", neuralVoice: "", neuralVoicePl: "", voiceURI: "", rate: 0.85, accent: "en-US", showPl: true },
  srs: {}, // wordId -> { box, due, seen, correct }
  activity: {}, // "YYYY-MM-DD" -> { minutes, circle: [stepIds], xp }
  journal: [], // { date, text, feedback }
  why: "",
  goals: [],
  aiWords: {}, // level -> [word]
  topicNotes: {}, // topic -> missing words text
  chatHistory: {}, // roleplayId -> [{role, content, meta}]
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...structuredClone(DEFAULTS), ...parsed, settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) } };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* tryb prywatny lub brak miejsca – postęp tylko w tej sesji */
  }
}

export function getState() {
  return state;
}

export function update(fn) {
  fn(state);
  save();
}

export function resetAll() {
  state = structuredClone(DEFAULTS);
  save();
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ensureStarted() {
  if (!state.startDate) update((s) => (s.startDate = today()));
  triggerWidgetSync(1500);
}

export function currentWeek() {
  if (state.weekOverride) return state.weekOverride;
  if (!state.startDate) return 1;
  const days = Math.floor((Date.now() - new Date(state.startDate).getTime()) / 86400000);
  return Math.min(104, Math.max(1, Math.floor(days / 7) + 1));
}

export function logActivity({ minutes = 0, xp = 0, circleStep = null } = {}) {
  update((s) => {
    const d = (s.activity[today()] ||= { minutes: 0, circle: [], xp: 0 });
    d.minutes += minutes;
    d.xp += xp;
    if (circleStep && !d.circle.includes(circleStep)) d.circle.push(circleStep);
  });
}

export function streak() {
  let n = 0;
  const d = new Date();
  // Dzisiejszy dzień liczy się, jeśli już coś zrobiono; inaczej zaczynamy od wczoraj.
  const key = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  if (!state.activity[key(d)]) d.setDate(d.getDate() - 1);
  while (state.activity[key(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// --- Powtórki w odstępach (system Leitnera: pudełka 1-5) ---
const INTERVALS = [0, 1, 3, 7, 14, 30]; // dni

export function srsGrade(wordId, correct) {
  update((s) => {
    const card = (s.srs[wordId] ||= { box: 0, due: 0, seen: 0, correct: 0 });
    card.seen++;
    if (correct) {
      card.correct++;
      card.box = Math.min(5, card.box + 1);
    } else {
      card.box = 1;
      card.fails = (card.fails || 0) + 1;
      card.lastFailed = Date.now();
    }
    card.due = Date.now() + INTERVALS[card.box] * 86400000;
  });
  triggerWidgetSync();
}

export function srsDue(words) {
  const now = Date.now();
  return words.filter((w) => state.srs[w.id] && state.srs[w.id].due <= now);
}

export function srsNew(words) {
  return words.filter((w) => !state.srs[w.id]);
}

export function srsKnownCount() {
  return Object.values(state.srs).filter((c) => c.box >= 3).length;
}

// --- Nagrania (IndexedDB) ---
const DB_NAME = "eu-trainer-recordings";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("recs", { keyPath: "id", autoIncrement: true });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveRecording(topic, blob, transcript = "") {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("recs", "readwrite");
      tx.objectStore("recs").add({ topic, blob, transcript, date: Date.now() });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}

export async function listRecordings(topic) {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const req = db.transaction("recs").objectStore("recs").getAll();
      req.onsuccess = () => resolve(req.result.filter((r) => !topic || r.topic === topic).sort((a, b) => a.date - b.date));
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function deleteRecording(id) {
  try {
    const db = await openDb();
    db.transaction("recs", "readwrite").objectStore("recs").delete(id);
  } catch {
    /* brak IndexedDB */
  }
}

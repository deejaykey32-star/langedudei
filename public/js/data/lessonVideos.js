// Macierz filmów: każda z 240 lekcji × 48 tematów tarczy (po kolei) × 3 filmy.
// Filmy wyszukuje serwer przy pierwszym otwarciu (temat tarczy + temat lekcji) i zapamiętuje.
import { TOPICS, findTopic, findVideo } from "./topics.js";
import { findUnit, LESSON_TYPES } from "./course.js";
import { backend } from "../backend.js";

// Temat każdej jednostki po angielsku – łączony z dziedziną z tarczy.
export const THEME_EN = {
  "a1-hello": "greetings and meeting people", "a1-numbers": "numbers", "a1-family": "family", "a1-food": "food", "a1-home": "home and houses",
  "a1-routine": "daily routine", "a1-time": "time and weather", "a1-clothes": "clothes and colours", "a1-hobbies": "hobbies and skills", "a1-city": "the city",
  "a2-yesterday": "the past", "a2-plans": "the future", "a2-shopping": "shopping", "a2-restaurant": "restaurants and eating out", "a2-travel": "travel",
  "a2-directions": "maps and navigation", "a2-health": "health", "a2-work": "work and school", "a2-compare": "the biggest and the smallest", "a2-phone": "phones and communication",
  "b1-experiences": "adventure and experiences", "b1-opinions": "opinions and debate", "b1-if": "what if", "b1-technology": "everyday technology", "b1-environment": "the environment",
  "b1-feelings": "emotions and relationships", "b1-phrasal": "everyday life", "b1-stories": "storytelling",
  "b2-interview": "careers and jobs", "b2-media": "news and media", "b2-reported": "communication", "b2-regrets": "mistakes and decisions", "b2-idioms": "language and idioms",
  "b2-email": "writing and letters", "b2-lifestyle": "healthy lifestyle", "b2-debate": "arguments and debate",
  "c1-emphasis": "rhetoric and great speeches", "c1-academic": "research and science", "c1-collocations": "words and language", "c1-negotiation": "negotiation and business",
  "c1-society": "ethics and society", "c1-nuance": "meaning and interpretation",
  "c2-idioms": "metaphors", "c2-register": "formal and informal style", "c2-formal-grammar": "law and rules", "c2-irony": "humour and irony", "c2-precision": "precision and detail", "c2-literary": "literature and writing",
};

// Rodzaj lekcji zmienia charakter wyszukiwania – dzięki temu każda z 5 lekcji jednostki ma inne filmy.
const MOD = { words: "explained", sentences: "facts", listen: "story", dialogue: "interview", test: "quiz" };

export const ORDERED_TOPICS = TOPICS; // kolejność: Humanistyka → Przyroda → Technika → Codzienne życie

export function slotQueries(unit, key, topic) {
  const theme = THEME_EN[unit.id] || unit.title;
  const base = topic.q.replace(/^(TED-Ed|Kurzgesagt|BBC Learning English|BBC Learning English 6 Minute English)\s+/i, "");
  const easy = /^A/.test(unit.level) ? " for beginners" : "";
  return [`${topic.titleEn} and ${theme} ${MOD[key]}${easy}`, `${base} ${theme}`, `${topic.q} ${MOD[key]}`];
}

// ---- Pamięć podręczna po stronie przeglądarki ----
const KEY = "led-slots-v1";
let store = null;
function load() {
  if (store) return store;
  try {
    store = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    store = {};
  }
  return store;
}
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* brak miejsca – pamiętamy tylko w tej sesji */
  }
}

export function cachedSlot(lessonId, topicId) {
  return load()[`${lessonId}|${topicId}`] || null;
}

export async function fetchSlot(lessonId, topic) {
  const hit = cachedSlot(lessonId, topic.id);
  if (hit) return hit;
  const [unitId, key] = lessonId.split(":");
  const unit = findUnit(unitId);
  const videos = await backend.slot(lessonId, topic.id, slotQueries(unit, key, topic));
  load()[`${lessonId}|${topic.id}`] = videos;
  persist();
  return videos;
}

// Informacje o filmie: z tarczy tematów albo z macierzy lekcji.
export function videoMeta(videoId, lessonId = "", topicId = "") {
  if (lessonId && topicId) {
    const v = cachedSlot(lessonId, topicId)?.find((x) => x.id === videoId);
    if (v) return { video: v, topic: findTopic(topicId), lessonId };
  }
  const st = findVideo(videoId);
  if (st) return { ...st, lessonId: "" };
  for (const [k, list] of Object.entries(load())) {
    const v = list.find((x) => x.id === videoId);
    if (v) {
      const [lid, tid] = k.split("|");
      return { video: v, topic: findTopic(tid), lessonId: lid };
    }
  }
  return null;
}

export const LESSON_COUNT = () => 48 * LESSON_TYPES.length;

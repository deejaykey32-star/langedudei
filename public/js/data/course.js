// Kurs A1–C2: jednostki → lekcje (ścieżka lekcji).
import { UNITS_A } from "./units_a.js";
import { UNITS_B } from "./units_b.js";
import { UNITS_C } from "./units_c.js";
import { getState } from "../storage.js";

export const COURSE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const RAW = { ...UNITS_A, ...UNITS_B, ...UNITS_C };

// Zamienia zapis "a|b|c" na obiekty.
export function parseUnit(u, level) {
  if (u.parsed) return u;
  return {
    ...u,
    level,
    parsed: true,
    words: u.words.map((w) => {
      if (typeof w !== "string") return w;
      const [en, pl, emoji] = w.split("|");
      return { en, pl, emoji };
    }),
    sentences: u.sentences.map((s) => {
      if (typeof s !== "string") return s;
      const [en, pl] = s.split("|");
      return { en, pl };
    }),
    dialogue: u.dialogue.map((d) => {
      if (typeof d !== "string") return d;
      const [who, en, pl] = d.split("|");
      return { who, en, pl };
    }),
    question: Array.isArray(u.question) ? { q: u.question[0], options: u.question[1], answer: u.question[2] } : u.question,
    errors: (u.errors || []).map((e) => {
      if (typeof e !== "string") return e;
      const [wrong, right, why] = e.split("|");
      return { wrong, right, why };
    }),
  };
}

const PARSED = Object.fromEntries(COURSE_LEVELS.map((l) => [l, (RAW[l] || []).map((u) => parseUnit(u, l))]));

export function unitsForLevel(level) {
  const ai = (getState().aiUnits?.[level] || []).map((u) => parseUnit(u, level));
  return [...PARSED[level], ...ai];
}

export function findUnit(id) {
  for (const l of COURSE_LEVELS) {
    const u = unitsForLevel(l).find((x) => x.id === id);
    if (u) return u;
  }
  return null;
}

// Każda jednostka: 4 lekcje + sprawdzian (można nim „przeskoczyć” jednostkę).
export const LESSON_TYPES = [
  { key: "words", title: "Słówka", icon: "🧩" },
  { key: "sentences", title: "Zdania", icon: "🧱" },
  { key: "listen", title: "Słuchanie i mówienie", icon: "🎧" },
  { key: "dialogue", title: "Dialog i gramatyka", icon: "💬" },
  { key: "test", title: "Sprawdzian jednostki", icon: "🏆" },
];

export function lessonId(unitId, key) {
  return `${unitId}:${key}`;
}

export function courseStats() {
  const s = getState().course || {};
  const lessons = s.lessons || {};
  let total = 0;
  let done = 0;
  for (const l of COURSE_LEVELS) {
    for (const u of PARSED[l]) {
      for (const t of LESSON_TYPES) {
        total++;
        if (lessons[lessonId(u.id, t.key)]?.done) done++;
      }
    }
  }
  return { total, done };
}

// Słowa i zdania całego poziomu – do dystraktorów.
export function levelPool(level) {
  const units = unitsForLevel(level);
  return {
    words: units.flatMap((u) => u.words),
    sentences: units.flatMap((u) => u.sentences),
    dialogueLines: units.flatMap((u) => u.dialogue),
  };
}

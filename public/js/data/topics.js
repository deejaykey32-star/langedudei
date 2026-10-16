// Tarcza tematów: 3 dziedziny × 12 tematów naukowych + 12 tematów z codziennego życia (białe koło).
import { TOPICS_HP } from "./topics_hp.js";
import { TOPICS_TL } from "./topics_tl.js";
import { TOPIC_VIDEOS } from "./topicVideos.js";

export const DOMAINS = {
  H: { key: "H", name: "Humanistyka", nameEn: "Humanities", icon: "📜", colors: ["#1d4ed8", "#2563eb"], light: "#dbe7ff" },
  P: { key: "P", name: "Przyroda", nameEn: "Nature", icon: "🌿", colors: ["#15803d", "#16a34a"], light: "#dcf5e4" },
  T: { key: "T", name: "Technika", nameEn: "Technology", icon: "⚙️", colors: ["#b91c1c", "#dc2626"], light: "#fde0e0" },
  L: { key: "L", name: "Codzienne życie", nameEn: "Everyday life", icon: "🏠", colors: ["#ffffff", "#f4f4f5"], light: "#ffffff" },
};

const SHORT = { "t-computers": "Computers", "t-graphics": "Graphics", "t-ai": "AI", "t-gamedev": "Gamedev", "t-multimedia": "Video", "t-security": "Security" };

function parse(t) {
  return {
    ...t,
    short: SHORT[t.id] || t.titleEn.split(" ")[0].replace(/,$/, ""),
    words: t.words.map((w) => {
      const [en, pl, emoji] = w.split("|");
      return { en, pl, emoji, id: `topic:${t.id}:${en}` };
    }),
    sentences: t.sentences.map((s) => {
      const [en, pl] = s.split("|");
      return { en, pl };
    }),
    quiz: t.quiz.map(([q, options, answer]) => ({ q, options, answer })),
    videos: TOPIC_VIDEOS[t.id] || [],
    dialogue: [],
    errors: [],
    grammar: null,
  };
}

export const TOPICS = [...TOPICS_HP, ...TOPICS_TL].map(parse);

export function topicsOf(domain) {
  return TOPICS.filter((t) => t.domain === domain);
}

export function findTopic(id) {
  return TOPICS.find((t) => t.id === id);
}

export function findVideo(videoId) {
  for (const t of TOPICS) {
    const v = t.videos.find((x) => x.id === videoId);
    if (v) return { topic: t, video: v };
  }
  return null;
}

export const TOPIC_LESSONS = [
  { key: "words", title: "Słówka", icon: "🧩" },
  { key: "sentences", title: "Zdania", icon: "🧱" },
  { key: "quiz", title: "Quiz wiedzy", icon: "❓" },
  { key: "test", title: "Sprawdzian", icon: "🏆" },
];

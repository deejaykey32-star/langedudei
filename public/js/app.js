// Router aplikacji i nawigacja po sekcjach.
import { h, toast } from "./ui.js";
import { roosterSvg } from "./avatar.js";
import { getState, update, currentWeek, ensureStarted, streak } from "./storage.js";
import { weekPlan } from "./data/curriculum.js";
import { stopSpeaking } from "./speech.js";
import { api } from "./api.js";

import * as dashboard from "./sections/dashboard.js";
import * as course from "./sections/course.js";
import * as topics from "./sections/topics.js";
import * as plan from "./sections/plan.js";
import * as circle from "./sections/circle.js";
import * as threeListen from "./sections/threeListen.js";
import * as shadowing from "./sections/shadowing.js";
import * as superSlow from "./sections/superSlow.js";
import * as sameTopic from "./sections/sameTopic.js";
import * as review from "./sections/review.js";
import * as pictures from "./sections/pictures.js";
import * as grammar from "./sections/grammar.js";
import * as stories from "./sections/stories.js";
import * as chat from "./sections/chat.js";
import * as fiveSentences from "./sections/fiveSentences.js";
import * as films from "./sections/films.js";
import * as motivation from "./sections/motivation.js";
import * as settings from "./sections/settings.js";

export const SECTIONS = [
  { id: "dashboard", icon: "🏠", title: "Pulpit", mod: dashboard, group: "Start" },
  { id: "course", icon: "🎓", title: "Kurs A1 → C2 (lekcje)", mod: course, group: "Start" },
  { id: "topics", icon: "🎯", title: "Tarcza tematów + filmy", mod: topics, group: "Start" },
  { id: "plan", icon: "🗓️", title: "Plan 2 lata", mod: plan, group: "Start" },
  { id: "circle", icon: "⭕", title: "Krąg 30 minut", mod: circle, group: "Start" },
  { id: "chat", icon: "💬", title: "Rozmowa z lektorem AI", mod: chat, group: "Mówienie" },
  { id: "shadowing", icon: "🗣️", title: "Shadowing", mod: shadowing, group: "Mówienie" },
  { id: "same-topic", icon: "🔁", title: "Ten sam temat", mod: sameTopic, group: "Mówienie" },
  { id: "three-listen", icon: "🎧", title: "Zasada 3 odsłuchów", mod: threeListen, group: "Słuchanie" },
  { id: "super-slow", icon: "🐢", title: "Super Slow – 6 kroków", mod: superSlow, group: "Słuchanie" },
  { id: "stories", icon: "📖", title: "Historie", mod: stories, group: "Słuchanie" },
  { id: "films", icon: "🎬", title: "Filmy i seriale", mod: films, group: "Słuchanie" },
  { id: "pictures", icon: "🖼️", title: "Ćwiczenia obrazkowe", mod: pictures, group: "Słownictwo" },
  { id: "review", icon: "🧠", title: "Powtórki (pamięć)", mod: review, group: "Słownictwo" },
  { id: "grammar", icon: "📐", title: "Gramatyka", mod: grammar, group: "Słownictwo" },
  { id: "five-sentences", icon: "✍️", title: "5 zdań dziennie", mod: fiveSentences, group: "Pisanie" },
  { id: "motivation", icon: "🔥", title: "Motywacja", mod: motivation, group: "Ty" },
  { id: "settings", icon: "⚙️", title: "Lektor i ustawienia", mod: settings, group: "Ty" },
];

export const ctx = {
  ai: false,
  get week() {
    return currentWeek();
  },
  get plan() {
    return weekPlan(currentWeek());
  },
  get level() {
    return weekPlan(currentWeek()).level;
  },
  navigate(id) {
    location.hash = `#/${id}`;
  },
  refreshChrome() {
    renderNav();
  },
};

const main = document.getElementById("main");
const nav = document.getElementById("nav");

function renderNav() {
  const active = (location.hash.replace("#/", "") || "dashboard").split("?")[0];
  nav.replaceChildren();
  const p = ctx.plan;
  nav.append(
    h(
      "div",
      { class: "nav-status" },
      h("span", { class: "pill level" }, p.level),
      h("span", { class: "pill" }, `Tydzień ${p.week}/104`),
      h("span", { class: "pill" }, `🔥 ${streak()}`),
    ),
  );
  let group = "";
  for (const s of SECTIONS) {
    if (s.group !== group) {
      group = s.group;
      nav.append(h("div", { class: "nav-group" }, group));
    }
    nav.append(
      h(
        "a",
        { href: `#/${s.id}`, class: s.id === active ? "active" : "", onclick: () => document.body.classList.remove("nav-open") },
        h("span", { class: "nicon" }, s.icon),
        s.title,
      ),
    );
  }
}

async function route() {
  stopSpeaking();
  const [id, query] = (location.hash.replace("#/", "") || "dashboard").split("?");
  const section = SECTIONS.find((s) => s.id === id) || SECTIONS[0];
  renderNav();
  main.replaceChildren();
  main.scrollTop = 0;
  window.scrollTo(0, 0);
  document.title = `${section.title} · LangEduDei`;
  try {
    await section.mod.render(main, ctx, new URLSearchParams(query || ""));
  } catch (err) {
    console.error(err);
    main.append(h("div", { class: "card error" }, `Błąd sekcji: ${err.message}`));
  }
}

document.getElementById("menu-btn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
window.addEventListener("hashchange", route);

window.addEventListener("tts-missing", (e) =>
  toast(
    e.detail.lang.startsWith("pl")
      ? "Brak polskiego głosu – uruchom serwer z internetem, aby działał lektor neuronowy."
      : "Brak angielskiego głosu. Lektor neuronowy wymaga internetu (serwer). Możesz też doinstalować angielski głos w Windows: Ustawienia → Czas i język → Mowa.",
    "error",
  ),
);

// Kurak w logo i jako ikona karty
document.getElementById("brand-av").innerHTML = roosterSvg("happy", 38);
const fav = document.querySelector('link[rel="icon"]');
if (fav) fav.href = `data:image/svg+xml,${encodeURIComponent(roosterSvg("happy", 64))}`;

ensureStarted();
// Motyw
const theme = getState().settings.theme;
if (theme) document.documentElement.dataset.theme = theme;

api.status().then((s) => {
  ctx.ai = Boolean(s.ai);
  ctx.keyConfigured = Boolean(s.keyConfigured);
});
route();

// Eksport do debugowania
window.__eu = { getState, update };

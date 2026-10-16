import { h, sectionHeader, speakBtn, brandName } from "../ui.js";
import { guideSays } from "../avatar.js";
import { isNative } from "../backend.js";
import { apkCard } from "../apkDownload.js";
import { getState, today, streak, srsKnownCount, srsDue } from "../storage.js";
import { CIRCLE_STEPS, TIPS, LEVEL_PLAN } from "../data/curriculum.js";
import { wordsForLevel } from "../data/vocab.js";

export function render(root, ctx) {
  const s = getState();
  const p = ctx.plan;
  const day = s.activity[today()] || { minutes: 0, circle: [], xp: 0 };
  const due = srsDue(wordsForLevel(p.level, { upTo: true })).length;
  const progress = Math.round(((p.week - 1) / 104) * 100);

  root.append(
    sectionHeader("🐓", h("span", {}, "Witaj w ", brandName(), "!"), "Od A1 do C2 w 2 lata – wolno, jasno i codziennie po trochu (metody Doma)."),
    guideSays(
      streak() > 0
        ? `Seria: ${streak()} ${streak() === 1 ? "dzień" : "dni"} – tak trzymać! ${due ? `Dziś czeka ${due} słówek do powtórki` : "Wszystkie słówka powtórzone"} i krąg 30 minut. Kliknij mnie, a powiem to po angielsku.`
        : "Jestem Kurak, Twój przewodnik i lektor. Codziennie 30 minut, a za dwa lata będziesz gadać jak rodowity Anglik! Kliknij mnie, a powiem to po angielsku.",
      {
        en: streak() > 0
          ? `I say, I say, boy! ${streak()} ${streak() === 1 ? "day" : "days"} in a row! That's what I call commitment. Now, let's get to work!`
          : "I say, I say, welcome to LangEduDei! I'm Kurak, your guide. Thirty minutes a day, and you'll be talking like a native. Let's go, boy!",
        mood: "talk",
      },
    ),
    h(
      "div",
      { class: "grid stats" },
      stat("📅", `Tydzień ${p.week}`, "z 104"),
      stat("🎓", p.level, `${p.weekInLevel}/${p.weeksInLevel} tydz. poziomu`),
      stat("🔥", streak(), "dni z rzędu"),
      stat("🧠", srsKnownCount(), "utrwalonych słów"),
      stat("⏱️", day.minutes, "minut dziś"),
    ),
    h(
      "div",
      { class: "card" },
      h("div", { class: "row space" }, h("h2", {}, "Twoja droga A1 → C2"), h("span", { class: "muted" }, `${progress}%`)),
      h("div", { class: "progress" }, h("div", { class: "bar", style: `width:${progress}%` })),
      h(
        "div",
        { class: "levels-track" },
        LEVEL_PLAN.map((l) => h("div", { class: `lvl ${l.level === p.level ? "now" : p.week > l.to ? "done" : ""}` }, l.level)),
      ),
      h("p", {}, h("strong", {}, "Cel poziomu: "), p.levelGoal),
    ),
    h(
      "a",
      { class: "card course-cta", href: "#/course" },
      h("div", { class: "big-emoji" }, "🎓"),
      h("div", { class: "grow" }, h("h2", {}, "Kurs A1 → C2 – lekcje krok po kroku"), h("p", { class: "muted" }, "48 jednostek, 240 lekcji i sprawdzianów: obrazki, układanie zdań, dyktanda, mówienie, dialogi, gramatyka, testy poziomów.")),
      h("span", { class: "btn primary" }, "Kontynuuj ▶"),
    ),
    h(
      "a",
      { class: "card course-cta topics-cta", href: "#/topics" },
      h("div", { class: "big-emoji" }, "🎯"),
      h("div", { class: "grow" }, h("h2", {}, "Tarcza tematów + filmy YouTube"), h("p", { class: "muted" }, "Humanistyka 🔵 · Przyroda 🟢 · Technika 🔴 – po 12 tematów, a w środku ⚪ 12 tematów z codziennego życia. 96 filmów z ćwiczeniami.")),
      h("span", { class: "btn primary" }, "Wybierz temat ▶"),
    ),
    h(
      "div",
      { class: "grid two" },
      h(
        "div",
        { class: "card" },
        h("h2", {}, "📌 Plan tego tygodnia"),
        h(
          "ul",
          { class: "plain" },
          h("li", {}, "🧩 Słownictwo: ", h("a", { href: "#/pictures" }, p.vocabTheme)),
          h("li", {}, "🗣️ Shadowing: ", h("a", { href: "#/shadowing" }, p.sentenceTheme)),
          p.grammar ? h("li", {}, "📐 Gramatyka: ", h("a", { href: `#/grammar?id=${p.grammar.id}` }, p.grammar.title)) : null,
          h("li", {}, "🔁 Temat do mówienia: ", h("a", { href: "#/same-topic" }, p.speakingTopic), " ", speakBtn(p.speakingTopic)),
          h("li", {}, "🧠 Słówka do powtórki: ", h("a", { href: "#/review" }, String(due))),
        ),
      ),
      h(
        "div",
        { class: "card" },
        h("h2", {}, "⭕ Dzisiejszy krąg 30 minut"),
        h(
          "ol",
          { class: "circle-list" },
          CIRCLE_STEPS.map((st) =>
            h(
              "li",
              { class: day.circle.includes(st.id) ? "done" : "" },
              h("a", { href: `#/${st.section}` }, `${st.icon} ${st.title}`),
              h("span", { class: "muted" }, ` · ${st.minutes} min`),
            ),
          ),
        ),
        h("a", { class: "btn primary", href: "#/circle" }, day.circle.length ? "Kontynuuj krąg ▶" : "Zacznij dzisiejszy krąg ▶"),
      ),
    ),
    apkCard({ compact: true }),
    h("h2", { class: "mt" }, "Wskazówki Doma – każda to sekcja w aplikacji"),
    h(
      "div",
      { class: "grid tips" },
      TIPS.map((t) => h("a", { class: "card tip-card", href: `#/${t.section}` }, h("div", { class: "big-emoji" }, t.icon), h("h3", {}, t.title), h("p", {}, t.text))),
    ),
  );
}

function stat(icon, value, label) {
  return h("div", { class: "card stat" }, h("div", { class: "stat-icon" }, icon), h("div", { class: "stat-value" }, String(value)), h("div", { class: "muted" }, label));
}

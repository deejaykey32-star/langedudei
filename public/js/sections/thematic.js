// Słownik tematyczny: słowa, zwroty i zagadnienia podzielone na kategorie tematyczne.
import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, shuffle, sample, toast } from "../ui.js";
import { speak } from "../speech.js";
import { getState, update, logActivity } from "../storage.js";
import { CATEGORIES, categoryContent, findCategory } from "../data/thematic.js";
import { buildLesson } from "../exercises.js";
import { player } from "./course.js";
import { sentenceRow } from "../components.js";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const progress = () => getState().thematic || {};

export function render(root, ctx, params) {
  if (params.get("practice")) return practiceView(root, params.get("practice"), params.get("what") || "words");
  if (params.get("id")) return categoryView(root, params.get("id"), params.get("tab") || "words");
  return listView(root);
}

// ---------------- Lista kategorii + wyszukiwarka ----------------
function listView(root) {
  const contents = CATEGORIES.map((c) => ({ cat: c, data: categoryContent(c) }));
  const totalWords = contents.reduce((n, x) => n + x.data.words.length, 0);
  const totalPhrases = contents.reduce((n, x) => n + x.data.phrases.length + x.data.sentences.length, 0);
  const results = h("div", { class: "dict-results" });
  const search = h("input", { type: "search", class: "grow", placeholder: "Szukaj słowa lub zwrotu po angielsku albo po polsku…", autocomplete: "off" });
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    if (q.length < 2) return results.replaceChildren();
    const hits = [];
    for (const { cat, data } of contents) {
      for (const w of data.words) if (w.en.toLowerCase().includes(q) || w.pl.toLowerCase().includes(q)) hits.push({ cat, en: w.en, pl: w.pl, emoji: w.emoji, kind: "słowo" });
      for (const p of [...data.phrases, ...data.sentences]) if (p.en.toLowerCase().includes(q) || p.pl.toLowerCase().includes(q)) hits.push({ cat, en: p.en, pl: p.pl, emoji: "💬", kind: "zwrot" });
    }
    results.replaceChildren(
      h("p", { class: "muted small" }, hits.length ? `Znaleziono: ${hits.length}` : "Brak wyników."),
      ...hits.slice(0, 40).map((x) =>
        h(
          "div",
          { class: "dict-hit" },
          h("span", { class: "dict-emoji" }, x.emoji),
          h("div", { class: "grow" }, h("strong", {}, x.en), " ", speakBtn(x.en), h("div", { class: "muted small" }, x.pl)),
          h("a", { class: "pill", href: `#/thematic?id=${x.cat.id}&tab=${x.kind === "słowo" ? "words" : "phrases"}` }, `${x.cat.emoji} ${x.cat.name}`),
        ),
      ),
    );
  });

  root.append(
    sectionHeader("📚", "Słownik tematyczny", `Słowa, zwroty i zagadnienia z całej aplikacji podzielone na ${CATEGORIES.length} kategorii tematycznych: ${totalWords} słów i ${totalPhrases} zwrotów i zdań.`),
    tipBox("Ucz się słów w grupach tematycznych – mózg łatwiej zapamiętuje słowa połączone jedną sytuacją niż przypadkową listę."),
    h("div", { class: "card row wrap" }, h("span", {}, "🔍"), search),
    results,
    h(
      "div",
      { class: "grid cards dict-cats" },
      contents.map(({ cat, data }) => {
        const p = progress()[cat.id] || {};
        return h(
          "a",
          { class: "card dict-cat", href: `#/thematic?id=${cat.id}` },
          h("div", { class: "big-emoji" }, cat.emoji),
          h("h3", {}, cat.name),
          h("div", { class: "muted small" }, cat.nameEn),
          h(
            "div",
            { class: "dict-counts" },
            h("span", { class: "pill" }, `🧩 ${data.words.length} słów`),
            h("span", { class: "pill" }, `💬 ${data.phrases.length + data.sentences.length} zwrotów`),
            h("span", { class: "pill" }, `📌 ${data.grammar.length + data.units.length + data.topics.length + data.talk.length} zagadnień`),
          ),
          p.words || p.phrases ? h("div", { class: "stars" }, `Słowa ${p.words ? "★".repeat(p.words) : "–"} · Zwroty ${p.phrases ? "★".repeat(p.phrases) : "–"}`) : null,
        );
      }),
    ),
  );
}

// ---------------- Kategoria ----------------
function categoryView(root, id, tab) {
  const cat = findCategory(id);
  if (!cat) return root.append(h("p", {}, "Nie znaleziono kategorii."));
  const data = categoryContent(cat);
  const pane = h("div");
  const tabs = [
    { id: "words", label: `🧩 Słowa (${data.words.length})` },
    { id: "phrases", label: `💬 Zwroty (${data.phrases.length + data.sentences.length})` },
    { id: "topics", label: `📌 Zagadnienia (${data.grammar.length + data.units.length + data.topics.length + data.talk.length})` },
  ];
  let active = tabs.find((t) => t.id === tab) ? tab : "words";
  const tabsEl = h("div", { class: "video-tabs" });
  const drawTabs = () => tabsEl.replaceChildren(...tabs.map((t) => h("button", { class: `step-tab ${t.id === active ? "active" : ""}`, onclick: () => ((active = t.id), drawTabs(), draw()) }, t.label)));

  let level = "";
  function draw() {
    if (active === "words") {
      const levels = LEVELS.filter((l) => data.words.some((w) => w.level === l));
      const list = data.words.filter((w) => !level || w.level === level);
      pane.replaceChildren(
        h(
          "div",
          { class: "row wrap" },
          h("button", { class: `chip ${level ? "" : "added"}`, onclick: () => ((level = ""), draw()) }, "Wszystkie"),
          ...levels.map((l) => h("button", { class: `chip ${level === l ? "added" : ""}`, onclick: () => ((level = l), draw()) }, l)),
          h("a", { class: "btn primary small", href: `#/thematic?practice=${cat.id}&what=words` }, "🏋️ Ćwicz słowa"),
          h(
            "button",
            {
              class: "btn small",
              onclick: (e) => {
                update((s) => {
                  for (const w of list) {
                    const arr = (s.aiWords[w.level] ||= []);
                    if (!arr.find((x) => x.en === w.en)) arr.push({ id: `${w.level}:dict:${w.en}`, en: w.en, pl: w.pl, emoji: w.emoji, example: w.example || w.en, level: w.level, theme: `Słownik: ${cat.name}` });
                  }
                });
                e.target.textContent = "✔ Dodano do powtórek";
                e.target.disabled = true;
              },
            },
            "🧠 Dodaj do powtórek",
          ),
        ),
        h(
          "div",
          { class: "gallery dict-gallery" },
          list.map((w) =>
            h(
              "button",
              { class: "gal-item", title: w.source, onclick: () => speak(w.en) },
              h("div", { class: "gal-emoji" }, w.emoji),
              h("strong", {}, w.en),
              h("span", { class: "muted" }, w.pl),
              h("span", { class: "pill tiny" }, w.level),
            ),
          ),
        ),
      );
    } else if (active === "phrases") {
      const more = h("div", { class: "list" });
      const rest = data.sentences;
      let shown = 0;
      const showMore = () => {
        more.append(...rest.slice(shown, shown + 20).map((s) => sentenceRow(s)));
        shown += 20;
        if (shown >= rest.length) moreBtn.remove();
      };
      const moreBtn = h("button", { class: "btn ghost", onclick: showMore }, "Pokaż więcej zdań");
      pane.replaceChildren(
        h("div", { class: "row wrap" }, h("a", { class: "btn primary small", href: `#/thematic?practice=${cat.id}&what=phrases` }, "🏋️ Ćwicz zwroty")),
        h("h3", { class: "mt" }, "💬 Zwroty z życia"),
        h("div", { class: "list" }, data.phrases.map((p) => sentenceRow(p))),
        rest.length ? h("h3", { class: "mt" }, `🧱 Zdania z kursu i tarczy (${rest.length})`) : null,
        more,
        rest.length > 20 ? moreBtn : null,
      );
      showMore();
    } else {
      pane.replaceChildren(
        data.grammar.length ? h("div", {}, h("h3", {}, "📐 Gramatyka"), h("div", { class: "chips" }, data.grammar.map((g) => h("a", { class: "chip", href: `#/grammar?id=${g.id}` }, `${g.title} · ${g.level}`)))) : null,
        data.units.length ? h("div", {}, h("h3", { class: "mt" }, "🎓 Jednostki kursu"), h("div", { class: "chips" }, data.units.map((u) => h("a", { class: "chip", href: `#/course?hub=${u.id}:words` }, `${u.emoji} ${u.title} · ${u.level}`)))) : null,
        data.topics.length ? h("div", {}, h("h3", { class: "mt" }, "🎯 Tematy tarczy (z filmami)"), h("div", { class: "chips" }, data.topics.map((t) => h("a", { class: "chip", href: `#/topics?id=${t.id}` }, `${t.emoji} ${t.title}`)))) : null,
        h("h3", { class: "mt" }, "🗣️ Zagadnienia do rozmowy"),
        h("ul", { class: "talk-list" }, data.talk.map((q) => h("li", {}, q, " ", speakBtn(q)))),
        h("a", { class: "btn primary", href: `#/chat?cat=${cat.id}` }, "💬 Porozmawiaj o tym z Kurakiem"),
      );
    }
  }

  root.append(
    h("a", { href: "#/thematic", class: "back" }, "← Wszystkie kategorie"),
    h("header", { class: "dict-hero" }, h("div", { class: "topic-emoji" }, cat.emoji), h("div", {}, h("h1", {}, cat.name), h("div", { class: "muted" }, cat.nameEn, " ", speakBtn(cat.nameEn)))),
    tabsEl,
    h("div", { class: "card" }, pane),
  );
  drawTabs();
  draw();
  void speakPlBtn;
}

// ---------------- Ćwiczenia kategorii ----------------
function practiceView(root, id, what) {
  const cat = findCategory(id);
  if (!cat) return root.append(h("p", {}, "Nie znaleziono kategorii."));
  const data = categoryContent(cat);
  const words = sample(data.words, Math.min(8, data.words.length));
  const sentences = shuffle([...data.phrases, ...sample(data.sentences, 6)]).slice(0, 10);
  if (words.length < 4) {
    toast("Za mało słów w tej kategorii do ćwiczeń.", "error");
    return (location.hash = `#/thematic?id=${id}`);
  }
  const unit = { id: `dict-${id}`, level: words[0].level || "A2", words, sentences, dialogue: [], errors: [], grammar: null };
  const back = `#/thematic?id=${id}&tab=${what}`;
  player(root, {
    title: `${cat.emoji} ${cat.name} · ${what === "words" ? "Słowa" : "Zwroty"}`,
    exercises: buildLesson(unit, what === "words" ? "words" : "sentences"),
    mode: "lesson",
    back,
    backLabel: "Wróć do kategorii",
    onFinish: (r) => {
      const stars = r.accuracy >= 95 ? 3 : r.accuracy >= 80 ? 2 : 1;
      update((s) => {
        const p = ((s.thematic ||= {})[id] ||= {});
        p[what] = Math.max(stars, p[what] || 0);
      });
      logActivity({ xp: 10 + stars * 2, minutes: r.minutes });
      return { xp: 10 + stars * 2, nextHref: `#/thematic?practice=${id}&what=${what === "words" ? "phrases" : "words"}`, nextLabel: what === "words" ? "💬 Teraz zwroty ▶" : "🧩 Teraz słowa ▶" };
    },
  });
}

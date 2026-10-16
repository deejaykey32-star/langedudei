import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, shuffle, sample, toast, levelSelect } from "../ui.js";
import { VOCAB } from "../data/vocab.js";
import { SENTENCES } from "../data/content.js";
import { speak, listen, sttAvailable, compareSpeech } from "../speech.js";
import { getState, update, srsGrade, logActivity } from "../storage.js";
import { api } from "../api.js";
import { loading } from "../components.js";

const MODES = [
  { id: "pic-word", icon: "🖼️➡️🔤", title: "Obrazek → słowo", desc: "Zobacz obrazek i wybierz słowo." },
  { id: "listen-pic", icon: "👂➡️🖼️", title: "Posłuchaj → obrazek", desc: "Lektor mówi słowo – kliknij właściwy obrazek." },
  { id: "pic-say", icon: "🖼️➡️🗣️", title: "Obrazek → powiedz", desc: "Nazwij obrazek na głos po angielsku." },
  { id: "pic-type", icon: "🖼️➡️⌨️", title: "Obrazek → napisz", desc: "Napisz słowo do obrazka." },
  { id: "sentence-scene", icon: "💬➡️🎬", title: "Zdanie → scena", desc: "Posłuchaj zdania i wybierz pasującą scenę." },
];

export function render(root, ctx) {
  let level = ctx.level;
  let theme = ctx.plan.vocabTheme;
  let mode = "pic-word";
  const themeSel = h("select");
  const area = h("div");

  const themes = () => [...Object.keys(VOCAB[level] || {}), ...((getState().aiWords[level] || []).length ? ["🤖 Moje słowa AI"] : [])];
  const words = () => (theme === "🤖 Moje słowa AI" ? getState().aiWords[level] || [] : VOCAB[level]?.[theme] || []);
  const levelWords = () => [...Object.values(VOCAB[level] || {}).flat(), ...(getState().aiWords[level] || [])];

  function fillThemes() {
    const t = themes();
    if (!t.includes(theme)) theme = t[0];
    themeSel.replaceChildren(...t.map((x) => h("option", { value: x, selected: x === theme }, x)));
    start();
  }
  themeSel.addEventListener("change", () => ((theme = themeSel.value), start()));

  const modeBar = h("div", { class: "mode-bar" });
  function drawModes() {
    modeBar.replaceChildren(
      ...MODES.map((m) =>
        h("button", { class: `mode ${m.id === mode ? "active" : ""}`, title: m.desc, onclick: () => ((mode = m.id), drawModes(), start()) }, h("div", { class: "mode-icon" }, m.icon), m.title),
      ),
    );
  }

  // --- Runda ćwiczeń ---
  let queue = [];
  let idx = 0;
  let score = 0;

  function start() {
    if (mode === "sentence-scene") {
      const all = Object.values(SENTENCES[level] || {}).flat();
      queue = sample(all, Math.min(8, all.length));
    } else {
      queue = shuffle(words()).slice(0, 10);
    }
    idx = 0;
    score = 0;
    nextQ();
  }

  function finish() {
    logActivity({ minutes: 3, xp: score * 2 });
    area.replaceChildren(
      h(
        "div",
        { class: "card center" },
        h("div", { class: "big-emoji" }, score / queue.length >= 0.8 ? "🏆" : "💪"),
        h("h2", {}, `Wynik: ${score} / ${queue.length}`),
        h("button", { class: "btn primary", onclick: start }, "🔁 Jeszcze raz"),
      ),
    );
    speak(score / queue.length >= 0.8 ? "Amazing work!" : "Good effort! Let's practise again.");
  }

  function result(ok, item, extra) {
    if (item.id) srsGrade(item.id, ok);
    if (ok) score++;
    const fb = h(
      "div",
      { class: `qfb ${ok ? "good" : "bad"}` },
      ok ? "✅ Dobrze! " : "❌ ",
      h("strong", {}, item.en),
      " — ",
      item.pl,
      speakPlBtn(item.pl),
      " ",
      speakBtn(item.en),
      extra || null,
      item.example ? h("div", { class: "muted" }, item.example, " ", speakBtn(item.example)) : null,
      h("div", {}, h("button", { class: "btn primary mt", onclick: () => (idx++, nextQ()) }, "Dalej ▶")),
    );
    area.querySelector(".qcard")?.append(fb);
    area.querySelectorAll(".option, .pic-option").forEach((b) => (b.disabled = true));
    speak(item.en);
  }

  function nextQ() {
    if (!queue.length) {
      area.replaceChildren(h("p", { class: "muted" }, "Brak słów w tym temacie."));
      return;
    }
    if (idx >= queue.length) return finish();
    const item = queue[idx];
    const progress = h("div", { class: "muted" }, `${idx + 1} / ${queue.length} · punkty: ${score}`);
    const card = h("div", { class: "card qcard center" }, progress);
    const distractors = (key) => sample(levelWords().filter((w) => w[key] !== item[key]), 3);

    if (mode === "pic-word") {
      const opts = shuffle([item, ...distractors("en")]);
      card.append(
        h("div", { class: "flash-emoji" }, item.emoji),
        h("div", { class: "options" }, opts.map((o) => h("button", { class: "btn option", onclick: (e) => (e.target.classList.add(o === item ? "correct" : "wrong"), result(o === item, item)) }, o.en))),
      );
    } else if (mode === "listen-pic") {
      const opts = shuffle([item, ...distractors("emoji")]);
      card.append(
        h("button", { class: "btn primary big", onclick: () => speak(item.en) }, "🔊 Posłuchaj"),
        h("button", { class: "btn ghost", onclick: () => speak(item.en, { rate: 0.6 }) }, "🐢"),
        h(
          "div",
          { class: "pic-options" },
          opts.map((o) => h("button", { class: "pic-option", onclick: (e) => (e.currentTarget.classList.add(o === item ? "correct" : "wrong"), result(o === item, item)) }, o.emoji)),
        ),
      );
      setTimeout(() => speak(item.en), 300);
    } else if (mode === "pic-say") {
      const out = h("div");
      const mic = h("button", { class: "btn primary big" }, "🎙️ Powiedz, co widzisz");
      mic.addEventListener("click", async () => {
        if (!sttAvailable()) return toast("Rozpoznawanie mowy działa w Chrome i Edge. Użyj trybu „napisz”.", "error");
        mic.textContent = "🔴 Słucham…";
        try {
          const said = await listen({ lang: getState().settings.accent });
          const { score: sc } = compareSpeech(item.en, said);
          result(sc >= 70, item, h("div", { class: "muted" }, `Usłyszałem: „${said || "…"}”`));
        } catch (e) {
          toast(e.message, "error");
        }
        mic.textContent = "🎙️ Powiedz, co widzisz";
      });
      card.append(
        h("div", { class: "flash-emoji" }, item.emoji),
        h("p", { class: "muted" }, "Podpowiedź: ", h("span", { class: "hint hidden" }, `${item.pl} · ${item.en[0]}…`), h("button", { class: "btn small ghost", onclick: (e) => (e.target.previousSibling.classList.remove("hidden"), e.target.remove()) }, "pokaż")),
        mic,
        h("button", { class: "btn ghost", onclick: () => result(false, item) }, "Nie wiem"),
        out,
      );
    } else if (mode === "pic-type") {
      const input = h("input", { type: "text", autocomplete: "off", placeholder: "Wpisz po angielsku…" });
      const check = () => {
        const a = input.value.trim().toLowerCase().replace(/^(a|an|the) /, "");
        const target = item.en.toLowerCase().replace(/ \(.*\)$/, "");
        result(a === target, item, a !== target ? h("div", { class: "muted" }, `Twoja odpowiedź: ${input.value}`) : null);
      };
      input.addEventListener("keydown", (e) => e.key === "Enter" && check());
      card.append(
        h("div", { class: "flash-emoji" }, item.emoji),
        h("p", { class: "muted" }, `${item.en.length} liter · zaczyna się na „${item.en[0]}”`),
        h("div", { class: "row center-row" }, input, h("button", { class: "btn primary", onclick: check }, "Sprawdź")),
      );
      setTimeout(() => input.focus(), 50);
    } else if (mode === "sentence-scene") {
      const all = Object.values(SENTENCES[level] || {}).flat();
      const opts = shuffle([item, ...sample(all.filter((s) => s.emoji !== item.emoji), 3)]);
      card.append(
        h("button", { class: "btn primary big", onclick: () => speak(item.en) }, "🔊 Posłuchaj zdania"),
        h("button", { class: "btn ghost", onclick: () => speak(item.en, { rate: 0.6 }) }, "🐢"),
        h(
          "div",
          { class: "pic-options scenes" },
          opts.map((o) => h("button", { class: "pic-option", onclick: (e) => (e.currentTarget.classList.add(o === item ? "correct" : "wrong"), result(o === item, item)) }, o.emoji)),
        ),
      );
      setTimeout(() => speak(item.en), 300);
    }
    area.replaceChildren(card);
  }

  // --- Generowanie nowych obrazków przez AI ---
  const genTopic = h("input", { type: "text", placeholder: "Temat, np. kitchen, sport, emotions…", class: "grow" });
  async function generate() {
    area.replaceChildren(loading("Lektor AI rysuje nowe obrazki…"));
    try {
      const known = levelWords().map((w) => w.en).join(", ");
      const data = await api.generate("words", level, genTopic.value.trim() || theme, known);
      update((s) => {
        const list = (s.aiWords[level] ||= []);
        for (const w of data.items) if (!list.find((x) => x.en === w.en)) list.push({ ...w, id: `${level}:ai:${w.en}`, level, theme: "🤖 Moje słowa AI" });
      });
      theme = "🤖 Moje słowa AI";
      fillThemes();
      toast(`Dodano ${data.items.length} nowych słów z obrazkami`, "success");
    } catch (e) {
      toast(e.message, "error");
      start();
    }
  }

  const gallery = h("details", { class: "card" }, h("summary", {}, "📚 Galeria słów tematu (kliknij, aby posłuchać)"));
  gallery.addEventListener("toggle", () => {
    if (!gallery.open) return;
    gallery.querySelector(".gallery")?.remove();
    gallery.append(h("div", { class: "gallery" }, words().map((w) => h("button", { class: "gal-item", onclick: () => speak(w.en) }, h("div", { class: "gal-emoji" }, w.emoji), h("strong", {}, w.en), h("span", { class: "muted" }, w.pl)))));
  });

  root.append(
    sectionHeader("🖼️", "Ćwiczenia obrazkowe", "Łącz słowa i zdania z obrazem, a nie z tłumaczeniem – tak zaczynasz myśleć po angielsku."),
    tipBox("Stop translating, start thinking in English. Gdy widzisz obrazek, od razu mów angielskie słowo – bez polskiego „po drodze”."),
    h(
      "div",
      { class: "card row wrap" },
      h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), fillThemes()))),
      h("label", {}, "Temat: ", themeSel),
      genTopic,
      h("button", { class: "btn", onclick: generate }, "🤖 Nowe obrazki AI"),
    ),
    modeBar,
    area,
    gallery,
  );
  drawModes();
  fillThemes();
}
